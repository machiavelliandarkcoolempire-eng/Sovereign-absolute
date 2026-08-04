import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";

// 💡 ไม่ต้อง import ethers แล้ว เพราะเราใช้ signer ที่ส่งมาจากหน้าบ้านโดยตรง

window.InitSovereignIrys = async function(signer) {
    try {
        // 🎯 ดึง Dedicated RPC (Alchemy Key 2)
        const dedicatedIrisRpc = "https://base-mainnet.g.alchemy.com/v2/wR5UgtUrkfPjKnqfMhm8k";

        const irysUploader = await WebUploader(WebEthereum)
            .withAdapter(EthersV6Adapter(signer)) // 🔴 โยน signer ที่รับมาจาก index.html เข้าไปโดยตรง
            .withRpc(dedicatedIrisRpc)
            .withNetwork("mainnet") 
            .withToken("base-eth")  
            .build();               
            
        return irysUploader;
    } catch (error) {
        console.error("[Irys Build] Initialization Failed:", error);
        throw error;
    }
};