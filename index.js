import { WebUploader } from "@irys/web-upload";
import { WebBaseEth } from "@irys/web-upload-ethereum"; 
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

window.InitSovereignIrys = async function(inputParam) {
    try {
        const dedicatedIrisRpc = "https://base-mainnet.g.alchemy.com/v2/wR5UgtUrkfPjKnqfMhm8k";

        // 🟢 AUTO-RESOLVE LOGIC: แปลง Input ทุกรูปแบบให้กลายเป็น BrowserProvider
        let targetProvider = inputParam;

        if (!inputParam) {
            // ถ้าไม่ส่งอะไรมาเลย ให้ดึงจาก window.ethereum ในเครื่องผู้ใช้
            targetProvider = new ethers.BrowserProvider(window.ethereum);
        } else if (inputParam.provider) {
            // ถ้าเผลอส่ง Signer เข้ามา ให้ดึง .provider ที่ซ่อนอยู่ข้างในออกมากู้สถานการณ์
            targetProvider = inputParam.provider;
        } else if (!inputParam.getSigner && typeof window.ethereum !== "undefined") {
            // ถ้าส่ง window.ethereum หรือ Object อื่นที่ไม่มี getSigner เข้ามา
            targetProvider = new ethers.BrowserProvider(window.ethereum);
        }

        const irysUploader = await WebUploader(WebBaseEth) 
            .withAdapter(EthersV6Adapter(targetProvider)) 
            .withRpc(dedicatedIrisRpc)
            .mainnet() 
            .build();               
            
        return irysUploader;
    } catch (error) {
        console.error("[Irys Build] Initialization Failed:", error);
        throw error;
    }
};