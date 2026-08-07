import { WebUploader } from "@irys/web-upload";
// FACT: ดึงคลาส WebBaseEth (คลาสที่ถูกต้องสำหรับเครือข่าย Base) จากแพ็กเกจ ethereum (แพ็กเกจเดียวที่มีอยู่จริง)
import { WebBaseEth } from "@irys/web-upload-ethereum"; 
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";
import { Buffer } from "buffer";

window.Buffer = window.Buffer || Buffer;

window.InitSovereignIrys = async function(inputParam) {
    try {
        let targetProvider;

        if (!inputParam) {
            targetProvider = new window.ethers.BrowserProvider(window.ethereum);
        } else if (inputParam.provider) {
            targetProvider = inputParam.provider;
        } else if (!inputParam.getSigner && typeof window.ethereum !== "undefined") {
            targetProvider = new ethers.BrowserProvider(window.ethereum);
        } else if (typeof inputParam.getSigner === 'function') {
            targetProvider = inputParam;
        } else {
            targetProvider = new window.ethers.BrowserProvider(inputParam);
        }

        // ใช้อะแดปเตอร์ WebBaseEth ตาม Official Specification ของ Irys SDK
        const irysUploader = await WebUploader(WebBaseEth).withAdapter(EthersV6Adapter(targetProvider));
        
        return irysUploader;

    } catch (error) {
        console.error("Irys Initialization Error:", error);
        throw error;
    }
}