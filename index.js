import { WebUploader } from "@irys/web-upload";
import { WebBaseEth } from "@irys/web-upload-base-eth"; 
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { Buffer } from "buffer";

// Guarantee the Irys SDK sees the Buffer, bridging esbuild and your web3-polyfill.js
window.Buffer = window.Buffer || Buffer;

window.InitSovereignIrys = async function(inputParam) {
    try {
        const dedicatedIrisRpc = "https://base-mainnet.g.alchemy.com/v2/wR5UgtUrkfPjKnqfMhm8k";

        let targetProvider;

        // 🟢 AUTO-RESOLVE LOGIC: Flawlessly handle MetaMask, Signers, and WalletConnect
        if (!inputParam) {
            // Fallback to injected window.ethereum
            targetProvider = new window.ethers.BrowserProvider(window.ethereum);
        } else if (inputParam.provider) {
            // Input is a Signer; extract the underlying provider
            targetProvider = inputParam.provider;
        } else if (typeof inputParam.getSigner === 'function') {
            // Input is already an ethers BrowserProvider
            targetProvider = inputParam;
        } else {
            // Input is a raw EIP-1193 provider (e.g., WalletConnect)
            targetProvider = new window.ethers.BrowserProvider(inputParam);
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