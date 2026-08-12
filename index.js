// index.js
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

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
        // 1. Strict Signer & Provider Validation
        if (!inputSigner || typeof inputSigner.signMessage !== 'function') {
            throw new Error("❌ CRITICAL: Invalid Signer.");
        }
        
        const provider = inputSigner.provider;
        if (!provider) {
            throw new Error("❌ CRITICAL: Signer disconnected from RPC.");
        }
        
        // 2. Network Validation with Timeout & Defensive Type Checking
        const network = await withTimeout(provider.getNetwork(), 10000, "CRITICAL: RPC Node dead or unresponsive.");
        
        // HARDENED: Optional chaining and fallback to prevent BigInt(undefined) crash
        const currentChainId = network?.chainId != null ? BigInt(network.chainId) : 0n;
        if (currentChainId !== 8453n) {
            throw new Error(`⛔ SYSTEM HALTED: Network mismatch. Expected Base Mainnet (8453).`);
        }

        // 3. RPC Resolution
        const targetRpcUrl = customRpcUrl || 
            (typeof window.getPrimaryIrysRpcUrl === 'function' ? window.getPrimaryIrysRpcUrl() : null) || 
            (Array.isArray(window.IRYS_ENDPOINTS) && window.IRYS_ENDPOINTS.length > 0 ? window.IRYS_ENDPOINTS[0] : "https://mainnet.base.org");

        // 4. Irys Builder Construction
        const builder = WebUploader(WebEthereum)
            .withAdapter(EthersV6Adapter(inputSigner))
            .withNetwork("mainnet")
            .withToken("base-eth");
            
        if (targetRpcUrl) builder.withRpc(targetRpcUrl);

        // 5. Build Execution with Timeout
        const irysUploader = await withTimeout(builder.build(), 15000, "CRITICAL: Irys build timed out.");
        
        // HARDENED: Optional chaining on address resolution
        if (!irysUploader?.address) {
            throw new Error("Address resolved to null during Irys initialization.");
        }
        
        window.SovereignIrysInstance = irysUploader;
        return irysUploader;

    } catch (error) {
        // 🛡️ CRITICAL FIX: Ensure system unlocks on failure to prevent UI bricking
        if (typeof window.unlockSystem === 'function') window.unlockSystem();
        throw new Error(`Irys Bridge Failed: ${error?.message || "Unknown Error"}`);
    } finally {
        // Guarantee mutex release
        isInitializingIrys = false;
    }
};