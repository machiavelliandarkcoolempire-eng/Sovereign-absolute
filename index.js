// index.js
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";

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
        if (BigInt(network.chainId) !== 8453n) throw new Error(`⛔ SYSTEM HALTED: Network mismatch. Must be Base Mainnet.`);

        const targetRpcUrl = customRpcUrl || 
            (typeof window.getPrimaryIrysRpcUrl === 'function' ? window.getPrimaryIrysRpcUrl() : null) || 
            (Array.isArray(window.IRYS_ENDPOINTS) && window.IRYS_ENDPOINTS.length > 0 ? window.IRYS_ENDPOINTS[0] : "https://mainnet.base.org");

        // [ PATCHED ]: กวาดล้างคำสั่งที่ขัดแย้งออก เพื่อให้สถาปัตยกรรม Match กับ SDK v0.0.4 แบบ 100%
        const builder = WebUploader(WebEthereum)
            .withAdapter(EthersV6Adapter(provider));
            
        if (targetRpcUrl) builder.withRpc(targetRpcUrl);

        const irysUploader = await withTimeout(builder.build(), 15000, "CRITICAL: Irys build timed out.");
        
        if (!irysUploader?.address) throw new Error("Address resolved to null.");
        
        window.SovereignIrysInstance = irysUploader;
        return irysUploader;

    } catch (error) {
        // LAYER 2 ENFORCEMENT: Guaranteed UI State Unlock
        if (typeof window.unlockSystem === 'function') {
            window.unlockSystem(true);
        }
        throw new Error(`Irys Bridge Failed: ${error?.message || "Unknown exception"}`);
    } finally {
        isInitializingIrys = false;
    }
};