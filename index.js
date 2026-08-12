// index.js
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

let isInitializingIrys = false;

// Hardened Timeout with strict memory cleanup
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
    if (isInitializingIrys) {
        throw new Error("⛔ SYSTEM BUSY: Irys initialization is already in progress.");
    }
    isInitializingIrys = true;

    try {
        // LAYER 1 & 2: Strict Validations & Optional Chaining
        if (!inputSigner || typeof inputSigner?.signMessage !== 'function') {
            throw new Error("❌ CRITICAL: Invalid or missing Signer.");
        }
        if (!inputSigner?.provider) {
            throw new Error("❌ CRITICAL: Signer disconnected from Provider interface.");
        }
        
        const provider = inputSigner.provider;
        const network = await withTimeout(provider.getNetwork(), 10000, "CRITICAL: Primary RPC Node timeout.");
        
        // Explicit BigInt coercion for strictly checking Ethers v6 format
        if (BigInt(network?.chainId || 0) !== 8453n) {
            throw new Error(`⛔ SYSTEM HALTED: Network mismatch. Sovereign Core requires Base Mainnet (8453).`);
        }

        const targetRpcUrl = customRpcUrl ?? 
                             (typeof window.getPrimaryIrysRpcUrl === 'function' ? window.getPrimaryIrysRpcUrl() : null) ?? 
                             (Array.isArray(window.IRYS_ENDPOINTS) && window.IRYS_ENDPOINTS.length > 0 ? window.IRYS_ENDPOINTS[0] : "https://mainnet.base.org");

        // LAYER 3: ADVERSARIAL FIX - Preserving original Signer state
        // Instead of overriding the signer's provider, we explicitly pass the sanitized RPC 
        // to Irys. If Irys fails to parse "8453", it is isolated inside its internal provider instance.
        
        const builder = WebUploader(WebEthereum)
            .withAdapter(EthersV6Adapter(inputSigner))
            .withNetwork("mainnet") // Irys internally maps "mainnet" + token to its respective node
            .withToken("base-eth");

        // Safely re-attach RPC only if it's explicitly defined, preventing undefined injections
        if (targetRpcUrl) {
            builder.withRpc(targetRpcUrl);
        }

        const irysUploader = await withTimeout(builder.build(), 15000, "CRITICAL: Irys construct timed out.");
        
        if (!irysUploader?.address) {
            throw new Error("❌ CRITICAL: Hardware/Address resolved to null.");
        }
        
        window.SovereignIrysInstance = irysUploader;
        return irysUploader;

    } catch (error) {
        // Enforced strict unlock as per directive, correcting original logic flaw
        window.unlockSystem?.();
        throw new Error(`Irys Bridge Failed: ${error?.message || "Unknown Memory Exception"}`);
    } finally {
        isInitializingIrys = false;
    }
};