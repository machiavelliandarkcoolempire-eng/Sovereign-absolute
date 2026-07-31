import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

window.InitSovereignIrys = async function(rawProvider) {
    try {
        const provider = new ethers.BrowserProvider(rawProvider);
        
        // 🛡️ ใช้ Alchemy RPC แทน Public RPC เพื่อป้องกันเว็บค้างเวลาอัปโหลดไฟล์วิดีโอใหญ่ๆ
        const ALCHEMY_RPC = "https://base-mainnet.g.alchemy.com/v2/QTZrknzCeDDEXAFCEBCMM";
        
        // 🔥 โครงสร้างที่ถูกต้องสำหรับ Irys SDK เวอร์ชั่นใหม่
        const irysUploader = await WebUploader(WebEthereum)
            .withAdapter(EthersV6Adapter(provider))
            .withToken("base-eth")       // บังคับใช้ Base Network
            .withNetwork("mainnet")      // ป้องกันบั๊กวิ่งไป Devnet
            .withRpc(ALCHEMY_RPC)        // ใช้ RPC ที่รองรับการส่งข้อมูลหนักๆ
            .build();                    // <--- สำคัญมาก! โค้ดเดิมของคุณขาดคำสั่งนี้
            
        return irysUploader;
    } catch (error) {
        console.error("[Irys Build] Initialization Failed:", error);
        
        if (error.message && error.message.includes("network")) {
            throw new Error("Irys Network Error: Unable to connect to Base Mainnet.");
        }
        throw error;
    }
};