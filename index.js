import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

// 1. Adaptive Chunked Upload Engine (OOM Guard)
const SOVEREIGN_LIMITS = {
    MAX_FILE_SIZE: 300 * 1024 * 1024, 
    IOS_SOFT_CAP: 150 * 1024 * 1024   
};

function getAdaptiveChunkStrategy(fileSize) {
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isMobile = /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) || isIOS;

    if (isIOS && fileSize > SOVEREIGN_LIMITS.IOS_SOFT_CAP) throw new Error("❌ [OOM Guard] ไฟล์เกิน 150MB บน iOS Safari");
    if (fileSize > SOVEREIGN_LIMITS.MAX_FILE_SIZE) throw new Error("❌ [Protocol Guard] ไฟล์เกิน 300MB");

    if (isIOS) return { chunkSize: 2 * 1024 * 1024, batchSize: 1 }; 
    if (isMobile) return { chunkSize: 2 * 1024 * 1024, batchSize: 2 }; 
    return { chunkSize: 5 * 1024 * 1024, batchSize: 3 }; 
}

// 2. Initialize Irys Node (Network & Token Locked)
window.InitSovereignIrys = async function(rawProvider) {
    if (!rawProvider) throw new Error("❌ Web3 Provider (Wallet) is required.");
    
    const provider = new ethers.BrowserProvider(rawProvider);
    await provider.send("eth_requestAccounts", []); 
    
    const irysUploader = await WebUploader(WebEthereum)
        .withAdapter(EthersV6Adapter(provider))
        .withNetwork("mainnet") 
        .withToken("base-eth"); 

    return irysUploader;
};

// 3. Sovereign Pipeline (Upload & Auto-Fund)
window.runSovereignPipeline = async function(file, displayContainerId) {
    try {
        if (!window.ethereum) throw new Error("❌ No Web3 Wallet detected.");
        
        const uploader = await window.InitSovereignIrys(window.ethereum);
        if (!uploader) throw new Error("❌ Irys Initialization failed.");

        const fileSize = file.size;
        const config = getAdaptiveChunkStrategy(fileSize);
        
        // [A] Auto-Funding Safe Buffer (20%)
        const priceNeeded = BigInt(await uploader.getPrice(fileSize));
        const balance = BigInt(await uploader.getLoadedBalance());

        if (balance < priceNeeded) {
            const fundAmount = (priceNeeded - balance) * 120n / 100n; 
            console.log(`💸 [Funding] Auto-funding: ${fundAmount.toString()} atomic units...`);
            await uploader.fund(fundAmount.toString());
            // [Architecture Fix]: รอ Node Sync ข้อมูลยอดเงินเล็กน้อย ป้องกัน Race Condition ก่อนเริ่มอัปโหลด
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // [B] Chunk Processing & Event Watchers
        const chunkedUploader = uploader.chunkedUploader;
        chunkedUploader.setChunkSize(config.chunkSize);
        chunkedUploader.setBatchSize(config.batchSize);

        chunkedUploader.on("chunkUpload", (chunkInfo) => {
            console.log(`📦 [Irys] Uploaded Chunk ID: ${chunkInfo.id}`);
        });
        chunkedUploader.on("chunkError", (e) => {
            console.error(`⚠️ [Irys] Chunk Error (Retrying...):`, e);
        });

        const tags = [{ name: "Content-Type", value: file.type }];
        console.log("🚀 [Upload] Initiating Arweave Data Spooling...");
        
        const receipt = await chunkedUploader.uploadData(file, { tags });
        
        // [C] Immediate Render
        const gatewayUrl = `https://gateway.irys.xyz/${receipt.id}`;
        renderSovereignMedia(gatewayUrl, file.type, displayContainerId);

        return receipt.id; 

    } catch (error) {
        console.error("❌ [Pipeline Error]:", error);
        throw error;
    }
};

// 4. Render Engine
function renderSovereignMedia(url, mimeType, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = ""; 

    if (mimeType.startsWith("video/")) {
        container.innerHTML = `
            <video controls autoplay loop playsinline style="width: 100%; border-radius: 8px;">
                <source src="${url}" type="${mimeType}">
            </video>
        `; // [Architecture Fix]: เพิ่ม `playsinline` เพื่อให้วิดีโอเล่นได้ปกติบน iOS Safari โดยไม่เด้ง Fullscreen
    } else {
        container.innerHTML = `
            <img src="${url}" style="width: 100%; border-radius: 8px;" />
        `;
    }
}