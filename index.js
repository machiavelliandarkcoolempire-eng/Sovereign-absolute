import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

window.InitSovereignIrys = async function(rawProvider) {
    if (!rawProvider) throw new Error("❌ Web3 Provider (Wallet) is required.");
    
    const provider = new ethers.BrowserProvider(rawProvider);
    
    // FACT: ลบ eth_requestAccounts ออก ป้องกัน MetaMask เด้งซ้ำซ้อน
    // FACT: ระบุ mainnet และ base-eth เพื่อความเสถียรบน Base L2
    const irysUploader = await WebUploader(WebEthereum)
        .withAdapter(EthersV6Adapter(provider))
        .withNetwork("mainnet") 
        .withToken("base-eth"); 

    return irysUploader;
};