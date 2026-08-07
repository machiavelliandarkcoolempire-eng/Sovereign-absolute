import { WebUploader } from "@irys/web-upload";
import { WebBaseEth } from "@irys/web-upload-ethereum"; 
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";

window.InitSovereignIrys = async function(signer) {
    try {
        const dedicatedIrisRpc = "https://base-mainnet.g.alchemy.com/v2/wR5UgtUrkfPjKnqfMhm8k";

        const irysUploader = await WebUploader(WebBaseEth) 
            .withAdapter(EthersV6Adapter(signer)) 
            .withRpc(dedicatedIrisRpc)
            .mainnet() 
            .build();               
            
        return irysUploader;
    } catch (error) {
        console.error("[Irys Build] Initialization Failed:", error);
        throw error;
    }
};