import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

window.InitSovereignIrys = async function(rawProvider) {
    if (!rawProvider) throw new Error("❌ Web3 Provider (Wallet) is required.");
    
    try {
        const provider = new ethers.BrowserProvider(rawProvider);
        
        // 🛡️ [NETWORK VALIDATION STAGE]
        // ตรวจสอบ Chain ID ทันทีเพื่อป้องกันการส่ง Request ข้าม Network
        const network = await provider.getNetwork();
        if (network.chainId !== 8453n) { // 8453n คือ Base Mainnet (BigInt requirement สำหรับ Ethers V6)
            throw new Error("⛔ SYSTEM HALTED: Please switch your wallet to Base Mainnet.");
        }
        
        // 🛡️ [RPC & IRYS INITIALIZATION STAGE]
        // INJECTED ALCHEMY RPC: ใช้สำหรับอ่านข้อมูลเพื่อหลบ Rate-Limit ของ MetaMask
        // MUST DO: ตั้งค่า Domain Allowlist ใน Alchemy Dashboard ป้องกัน API Key ถูกขโมยโควต้า
        const DEDICATED_BASE_RPC = "https://base-mainnet.g.alchemy.com/v2/wR5UgtUrkfPjKnqfMhm8k"; 

        const irysUploader = await WebUploader(WebEthereum)
            .withAdapter(EthersV6Adapter(provider))
            .withNetwork("mainnet") 
            .withToken("base-eth")
            .withRpc(DEDICATED_BASE_RPC); 

        if (typeof irysUploader.ready === 'function') {
            await irysUploader.ready();
        }

        console.log("✅ [NEXUS] Irys Modular Bridge Initialized via Alchemy RPC.");
        return irysUploader;

    } catch (error) {
        console.error("❌ [IRYS BRIDGE FAULT] Failed to initialize WebUploader:", error);
        const errorMsg = error.message || "Unknown initialization error";
        throw new Error(`Irys Bridge Initialization Failed: ${errorMsg}`);
    }
};