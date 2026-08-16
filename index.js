import { WebUploader } from "@irys/web-upload";
import { WebBaseEth } from "@irys/web-upload-ethereum"; 
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

window.InitSovereignIrys = async function(inputParam) {
    try {
        const dedicatedIrisRpc = "https://base-mainnet.g.alchemy.com/v2/wR5UgtUrkfPjKnqfMhm8k";

        let targetProvider;

        // 🟢 WATERTIGHT AUTO-RESOLVE LOGIC: ป้องกันการดึง Object ผิดประเภท
        if (inputParam && typeof inputParam.getSigner === 'function') {
            targetProvider = inputParam;
        } else if (inputParam && inputParam.provider && typeof inputParam.provider.getSigner === 'function') {
            targetProvider = inputParam.provider;
        } else if (inputParam && typeof inputParam.request === 'function') {
            targetProvider = new ethers.BrowserProvider(inputParam);
        } else if (typeof window.ethereum !== "undefined") {
            targetProvider = new ethers.BrowserProvider(window.ethereum);
        } else {
            throw new Error("CRITICAL: No valid Web3 Provider found in environment.");
        }

        const irysUploader = await WebUploader(WebBaseEth) 
            .withAdapter(EthersV6Adapter(targetProvider)) 
            .withRpc(dedicatedIrisRpc)
            .mainnet() 
            .build();               
            
        return irysUploader;
    } catch (error) {
        console.error("[IRYS FAULT] Initialization Failed:", error);
        throw error;
    }
};