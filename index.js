import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

window.InitSovereignIrys = async function(rawProvider) {
    try {
        const provider = new ethers.BrowserProvider(rawProvider);
        
        // 🔥 จุดที่แก้: บังคับให้ Irys รู้จัก Base Network และใช้เหรียญ base-eth
        const irysUploader = await WebUploader(WebEthereum)
            .withAdapter(EthersV6Adapter(provider))
            .withToken("base-eth") // <--- ถ้าไม่มีบรรทัดนี้ มันจะเชื่อมต่อไม่ติดครับ!
            .withRpc("https://mainnet.base.org"); // <--- บังคับให้วิ่งผ่าน Base RPC
            
        return irysUploader;
    } catch (error) {
        console.error("[Irys Build] Initialization Failed:", error);
        throw error;
    }
};