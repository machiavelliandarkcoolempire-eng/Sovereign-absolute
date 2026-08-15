import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

window.InitSovereignIrys = async function(inputSigner) {
    if (!inputSigner) throw new Error("❌ Web3 Signer is required.");
    
    try {
        // 🟢 WATERTIGHT AUTO-RESOLVE LOGIC: Irys strictly requires a Signer, not a Provider.
        if (typeof inputSigner.signMessage !== 'function') {
            throw new Error("CRITICAL: Input is not a valid Ethers v6 Signer.");
        }
        
        const provider = inputSigner.provider;
        if (!provider) {
            throw new Error("CRITICAL: Signer is disconnected from the RPC Provider.");
        }
        
        // 🛡️ [NETWORK VALIDATION STAGE]
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== 8453) { 
            throw new Error("⛔ SYSTEM HALTED: Please switch your wallet to Base Mainnet.");
        }
        
        // 🛡️ [RPC & IRYS INITIALIZATION STAGE]
        const DEDICATED_BASE_RPC = "https://base-mainnet.g.alchemy.com/v2/wR5UgtUrkfPjKnqfMhm8k"; 

        // 🎯 [CRITICAL FIX]: Pass the Signer directly to EthersV6Adapter
        const irysUploader = await WebUploader(WebEthereum)
            .withAdapter(EthersV6Adapter(inputSigner))
            .withNetwork("mainnet") 
            .withToken("base-eth")
            .withRpc(DEDICATED_BASE_RPC)
            .build(); 

        console.log("✅ [NEXUS] Irys Modular Bridge Initialized via Dedicated RPC.");
        return irysUploader;

    } catch (error) {
        console.error("❌ [IRYS BRIDGE FAULT] Failed to initialize WebUploader:", error);
        const errorMsg = error.message || "Unknown initialization error";
        throw new Error(`Irys Bridge Initialization Failed: ${errorMsg}`);
    }
};