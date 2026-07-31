import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

declare global {
  interface Window {
    InitSovereignIrys: (rawProvider: any, config?: any) => Promise<any>;
    handleMediaUpload: (file: File) => Promise<string | null>;
    ethereum?: any;
  }
}

/**
 * แปลงรหัสธุรกรรม Irys (43 อักขระ Base64URL) เป็นรหัส bytes32 Hex
 * (แพตช์ Gas Optimization สำหรับ Base L2)
 */
export function convertIrysTxIdToBytes32(txId: string): string {
  if (txId.length !== 43) throw new Error("Invalid Irys TxId length.");
  let base64 = txId.replace(/-/g, "+").replace(/_/g, "/");
  const padNeed = base64.length % 4;
  if (padNeed) base64 += "=".repeat(4 - padNeed);
  const binaryString = atob(base64);
  let hexResult = "";
  for (let i = 0; i < binaryString.length; i++) {
    hexResult += binaryString.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return "0x" + hexResult;
}

/**
 * แปลงข้อมูล bytes32 กลับเป็นรหัสธุรกรรม Irys 43 อักขระ
 */
export function convertBytes32ToIrysTxId(hexBytes32: string): string {
  const cleanHex = hexBytes32.startsWith("0x") ? hexBytes32.slice(2) : hexBytes32;
  if (cleanHex.length !== 64) throw new Error("Invalid bytes32 length.");
  let binaryString = "";
  for (let i = 0; i < cleanHex.length; i += 2) {
    binaryString += String.fromCharCode(parseInt(cleanHex.substring(i, i + 2), 16));
  }
  return btoa(binaryString).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Sovereign Irys Uploader Initialization Function
 * @param {Object} rawProvider - EIP-1193 Provider (e.g. window.ethereum)
 * @param {Object} [config={}] - Configuration options
 * @returns {Promise<Object>} Active Irys Uploader instance
 */
window.InitSovereignIrys = async function(rawProvider: any, config: any = {}): Promise<any> {
    try {
        if (!rawProvider) {
            throw new Error("EIP-1193 Web3 Provider required.");
        }

        const provider = new ethers.BrowserProvider(rawProvider);
        await provider.send("eth_requestAccounts", []); // Ensure connection
        await provider.getSigner();

        let builder = WebUploader(WebEthereum)
            .withAdapter(EthersV6Adapter(provider));

        if (config.rpcUrl) {
            builder = builder.withRpc(config.rpcUrl);
        }

        if (config.isDevnet) {
            builder = builder.devnet();
        } else {
            builder = builder.mainnet(); // บังคับเป็น Mainnet เสมอถ้าไม่เซ็ต Devnet
        }

        const irysUploader = await builder;

        console.log("✅ [Irys Ready] Connected Address:", irysUploader.address);
        return irysUploader;

    } catch (error: any) {
        // ดักจับ Error 4001: กรณีผู้ใช้กดยกเลิกในกระเป๋า
        if (error?.code === 4001 || error?.info?.error?.code === 4001) {
            console.warn("⚠️ [Web3] User rejected connection. Restoring UI state.");
            return null;
        }
        console.error("❌ [Irys Build] Initialization Failed:", error);
        throw error;
    }
};

/**
 * Handle Large Media Upload with Math Precision Funding (BigInt)
 * @param {File} file - The media file to upload
 */
window.handleMediaUpload = async function(file: File): Promise<string | null> {
    try {
        const uploader = await window.InitSovereignIrys(window.ethereum, { isDevnet: false });
        if (!uploader) return null; // หยุดทำงานถ้าผู้ใช้ Reject ไปในขั้นแรก

        const fileSizeInBytes = BigInt(file.size);

        // เช็คของฟรี: ถ้าเกิน 100 KiB ต้องจ่ายเงิน
        if (fileSizeInBytes > 102400n) {
            const priceNeeded = BigInt(await uploader.getPrice(Number(fileSizeInBytes)));
            const balance = BigInt(await uploader.getBalance());

            if (balance < priceNeeded) {
                // คณิตศาสตร์ Zero-Dust: คืนค่าให้เป๊ะระดับ BigInt พร้อมบัฟเฟอร์แก๊ส 20%
                const difference = priceNeeded - balance;
                const fundAmount = (difference * 120n) / 100n;
                console.log(`[Funding] Initiating auto-fund for ${fundAmount.toString()} atomic units...`);
                const fundTx = await uploader.fund(fundAmount.toString());
                console.log(`✅ [Funding] Success: ${fundTx.id}`);
            }
        }

        const tags = [{ name: "Content-Type", value: file.type }];
        const receipt = await uploader.uploadFile(file, { tags });
        
        console.log(`✅ [Upload] Complete. Irys TX: ${receipt.id}`);
        const bytes32Format = convertIrysTxIdToBytes32(receipt.id);
        console.log(`🔒 [Base L2 Ready] Bytes32 format: ${bytes32Format}`);
        
        return receipt.id;
    } catch (error: any) {
        // ดักจับ Error 4001: กรณีผู้ใช้กด Reject ตอนจ่ายเงิน
        if (error?.code === 4001 || error?.message?.includes("rejected")) {
            console.warn("⚠️ [Web3] User rejected the transaction. Operation aborted safely.");
            return null;
        }
        console.error("❌ [Upload] Operation failed:", error);
        throw error;
    }
};