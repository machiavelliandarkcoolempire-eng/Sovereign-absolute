// index.js
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

// 🛡️ [BUILT-IN RPC] ฝัง RPC ทั้งหมดไว้ในนี้โดยตรง
const LOCAL_IRYS_ENDPOINTS = [
    'https://base-mainnet.g.alchemy.com/v2/wR5UgtUrkfPjKnqfMhm8k', // Key 3 (ใหม่ - Primary)
    'https://base-mainnet.g.alchemy.com/v2/XOBcrOR6Zzmrgjg9osZWR', // Key 2
    'https://base-mainnet.g.alchemy.com/v2/QTZrknzCeDDEXAFCEBCMM', // Key 1
    'https://mainnet.base.org'
];

let isInitializingIrys = false;

const withTimeout = (promise, timeoutMs, timeoutMessage) => {
    let timer;
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
        })
    ]).finally(() => {
        if (timer) clearTimeout(timer);
    });
};

window.InitSovereignIrys = async function(inputSigner, customRpcUrl = null) {
    if (isInitializingIrys) throw new Error("⛔ SYSTEM BUSY: Irys initialization is already in progress.");
    isInitializingIrys = true;

    try {
        if (!inputSigner || typeof inputSigner.signMessage !== 'function') throw new Error("❌ CRITICAL: Invalid Signer.");
        const provider = inputSigner.provider;
        if (!provider) throw new Error("❌ CRITICAL: Signer disconnected from RPC.");
        
        const network = await withTimeout(provider.getNetwork(), 10000, "CRITICAL: RPC Node dead.");
        if (BigInt(network.chainId) !== 8453n) throw new Error(`⛔ SYSTEM HALTED: Network mismatch.`);

        // คงโครงสร้างเดิมทั้งหมด หาก window.IRYS_ENDPOINTS ไม่มี ให้ใช้ Key ใหม่ใน LOCAL_IRYS_ENDPOINTS[0] ทันที
        const targetRpcUrl = customRpcUrl 
            || (typeof window.getPrimaryIrysRpcUrl === 'function' ? window.getPrimaryIrysRpcUrl() : null) 
            || (Array.isArray(window.IRYS_ENDPOINTS) && window.IRYS_ENDPOINTS.length > 0 ? window.IRYS_ENDPOINTS[0] : LOCAL_IRYS_ENDPOINTS[0]);

        const builder = WebUploader(WebEthereum).withAdapter(EthersV6Adapter(inputSigner)).withNetwork("mainnet").withToken("base-eth");
        if (targetRpcUrl) builder.withRpc(targetRpcUrl);

        const irysUploader = await withTimeout(builder.build(), 15000, "CRITICAL: Irys build timed out.");
        
        if (!irysUploader.address) throw new Error("Address resolved to null.");
        window.SovereignIrysInstance = irysUploader;
        return irysUploader;

    } catch (error) {
        if (typeof window.lockSystem === 'function') window.lockSystem();
        throw new Error(`Irys Bridge Failed: ${error.message}`);
    } finally {
        isInitializingIrys = false;
    }
};