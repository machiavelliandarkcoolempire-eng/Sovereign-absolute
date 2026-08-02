import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

// ==========================================
// SOVEREIGN CORE PROTOCOL - ENCAPSULATED
// ==========================================
(() => {
    // [1] SECURED INTERNAL STATES: ปิดช่องโหว่ Global State Exposure
    // ซ่อนตัวแปรเหล่านี้จากระดับ Window ป้องกันการถูกแทรกแซงจากสคริปต์ภายนอก
    let irysInstance = null;
    let lastFundAttemptAt = 0;
    const FUND_COOLDOWN_MS = 60000;
    const blobGcCache = new Map();
    const MAX_BLOB_CACHE_SIZE = 50;

    // Expose เฉพาะ Irys instance แบบ Read-Only/Controlled Write ให้ภายนอกอ้างอิงได้
    Object.defineProperty(window, 'irys', {
        get: () => irysInstance,
        set: (val) => { irysInstance = val; }
    });

    window.InitSovereignIrys = async function(rawProvider) {
        const ethersProvider = new ethers.BrowserProvider(rawProvider);
        const irysUploader = await WebUploader(WebEthereum).withAdapter(EthersV6Adapter(ethersProvider));
        return irysUploader;
    };

    window.extractIrysId = function(input) {
        if (!input) return "";
        let clean = input.trim();
        
        if ((clean.startsWith('http://') || clean.startsWith('https://')) && !clean.includes('gateway.irys.xyz/')) {
            return clean;
        }

        if (clean.includes('gateway.irys.xyz/')) {
            clean = clean.split('gateway.irys.xyz/')[1].split('/')[0];
        } else if (clean.startsWith('ar://')) {
            clean = clean.replace('ar://', '');
        } else if (clean.startsWith('irys://')) {
            clean = clean.replace('irys://', '');
        } else {
            clean = clean.split('/')[0];
        }
        return clean.replace(/[^a-zA-Z0-9_-]/g, '');
    };

    window.buildIrysUrl = function(txId) {
        const cleanId = window.extractIrysId(txId);
        if (!cleanId) return "";
        if (cleanId.startsWith('http://') || cleanId.startsWith('https://')) {
            return cleanId;
        }
        return `https://gateway.irys.xyz/${cleanId}`;
    };

    window.registerBlobForGc = function(url, objectUrl) {
        if (!url || !objectUrl) return;
        if (blobGcCache.has(url)) return;
        
        if (blobGcCache.size >= MAX_BLOB_CACHE_SIZE) {
            const oldestKey = blobGcCache.keys().next().value;
            const oldestObjUrl = blobGcCache.get(oldestKey);
            try { URL.revokeObjectURL(oldestObjUrl); } catch(e) {}
            blobGcCache.delete(oldestKey);
        }
        blobGcCache.set(url, objectUrl);
    };

    window.fetchWithCacheSovereign = async function(url, signal = null) {
        if (!url || url.trim() === "") return url;

        // [HOTFIX 1] MEMORY OBTENTION: ดึง Object URL จาก RAM ทันทีถ้ามี (โหลด 0ms)
        // บล็อกการสร้าง Object URL ซ้ำซ้อนที่ก่อให้เกิด Memory Leak อย่างเด็ดขาด
        if (blobGcCache.has(url)) {
            return blobGcCache.get(url);
        }

        let cache = null; let objectUrl = null;

        try {
            if (window.caches) {
                cache = await caches.open('sovereign-matrix-cache-v1');
                const cachedResponse = await cache.match(url);
                if (cachedResponse) {
                    const blob = await cachedResponse.blob();
                    objectUrl = URL.createObjectURL(blob);
                    window.registerBlobForGc(url, objectUrl);
                    return objectUrl;
                }
            }
        } catch (e) {
            console.warn("[Sovereign Cache Warning] Failed to access local cache:", e);
        }
        
        let cleanUri = window.extractIrysId(url);
        const fetchFromGateway = async (gatewayUrl) => {
            let retries = 3; let delay = 1000;
            while (retries > 0) {
                try {
                    const res = await fetch(gatewayUrl, { signal });
                    if (!res.ok) throw new Error(`Gateway HTTP ${res.status}`);
                    return await res.blob();
                } catch (err) {
                    retries--;
                    if (retries === 0) throw err;
                    await new Promise(r => setTimeout(r, delay)); delay *= 2; 
                }
            }
        };

        let timerId;
        const timeoutGuardian = new Promise((_, reject) => {
            timerId = setTimeout(() => reject(new Error("GATEWAY_TIMEOUT")), 8000);
            if (signal) {
                signal.addEventListener('abort', () => {
                    clearTimeout(timerId);
                    reject(new Error("ABORTED"));
                });
            }
        });

        try {
            const targetUrl = cleanUri.startsWith('http') ? cleanUri : `https://gateway.irys.xyz/${cleanUri}`;
            const blob = await Promise.race([fetchFromGateway(targetUrl), timeoutGuardian]);
            
            // [2] ERROR HANDLING: ปิดช่องโหว่ Error Suppression
            if (cache) cache.put(url, new Response(blob)).catch(e => {
                console.error("[Sovereign Core] Storage Quota Exceeded or Cache Fault:", e);
            });
            
            objectUrl = URL.createObjectURL(blob);
            window.registerBlobForGc(url, objectUrl);
            return objectUrl;
        } catch (err) {
            return cleanUri.startsWith('http') ? cleanUri : `https://gateway.irys.xyz/${cleanUri}`;
        } finally {
            clearTimeout(timerId);
        }
    };


    window.ensureIrysReady = async function(timeoutMs = 60000) {
        if (window.irys) return true;
        
        if (!window.activeRawProvider) throw new Error("EVM Provider Uninitialized. Please connect Web3 Wallet first.");
        
        window.updateBridgeStatus("ENGAGING IRYS BRIDGE...", "warning");
        window.appendLog("Engaging isolated Irys Settlement Bridge via Custom Sovereign Bundle...", "text-blue-400");

        try {
            const initPromise = (async () => {
                window.irys = await window.InitSovereignIrys(window.activeRawProvider);
                return true;
            })();

            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Irys initialization timeout")), timeoutMs));

            await Promise.race([initPromise, timeoutPromise]);

            window.updateBridgeStatus("✅ IRYS PERMANENT BRIDGE ONLINE", "success");
            window.appendLog("Autonomous Irys permanent settlement bridge successfully engaged.", "text-emerald-400 font-bold");
            return true;
        } catch (err) {
            window.irys = null;
            window.updateBridgeStatus("⚠ BRIDGE ERROR (CHECK LOG)", "error");
            window.appendLog(`[IRYS FAULT] Bridge protocol initialization failed: ${err.message}`, "text-rose-500 font-bold");
            throw err;
        }
    };

    window.withNetworkRetry = async function(fn, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try { return await fn(); }
            catch (e) {
                if (i === retries - 1) throw e;
                await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
            }
        }
    };

    window.executeIrysUpload = async function(payload, tags, isFile = false, progressCtrl = null) {
        await window.ensureIrysReady();
        const size = isFile ? payload.size : new Blob([payload]).size;
        
        const price = await window.withNetworkRetry(() => window.irys.getPrice(size));
        const initialBalance = await window.withNetworkRetry(() => window.irys.getLoadedBalance());

        if (initialBalance.isLessThan(price)) {
            const diffWithBuffer = price.minus(initialBalance).multipliedBy(115).dividedToIntegerBy(100);
            const costStr = window.fmtUnits(diffWithBuffer.toString());

            const msSinceLastFund = Date.now() - lastFundAttemptAt;
            if (msSinceLastFund < FUND_COOLDOWN_MS) {
                const waitSec = Math.ceil((FUND_COOLDOWN_MS - msSinceLastFund) / 1000);
                throw new Error(`กรุณารออีก ${waitSec} วินาทีก่อนเติมเงินรอบใหม่ (ระบบกันเสียเงินซ้ำจากธุรกรรมก่อนหน้าที่อาจยังไม่เข้าระบบ)`);
            }
            
            window.updateBridgeStatus("AWAITING FUNDING TX...", "warning");
            window.appendLog(`Awaiting user transaction: Funding ${costStr} ETH`, "text-yellow-400");
            
            const isConfirmed = await window.requestFundConfirmation(costStr);
            if (!isConfirmed) throw new Error("User declined funding.");
            
            window.showFundingOverlay(costStr);
            lastFundAttemptAt = Date.now();

            let fundCallFailed = false;
            try {
                // [HOTFIX 2] TYPE PRECISION LIMIT: บังคับ toString() ป้องกัน BigNumber Type Conflict
                // [FIX 4] ความเสี่ยงจากการโอนเงิน 0 ETH
                if (diffWithBuffer.toString() !== "0") {
                    await window.irys.fund(diffWithBuffer.toString());
                } else {
                    window.appendLog("ยอดที่ขาดมีขนาดเล็กมาก ระบบทำการข้ามขั้นตอนการโอนเงิน 0 ETH", "text-slate-400");
                }
            } catch (fundErr) {
                const feMsg = (fundErr && fundErr.message) || "";
                const isUserRejection = /user rejected|declined|denied|cancelled|user declined/i.test(feMsg);
                if (isUserRejection) {
                    window.hideFundingOverlay();
                    // [FIX 1] บั๊ก Cooldown ล็อกผู้ใช้ถาวรเมื่อกดยกเลิก
                    lastFundAttemptAt = 0; 
                    throw new Error("การทำธุรกรรมเติมเงินถูกยกเลิกโดยผู้ใช้");
                }
                fundCallFailed = true;
                window.appendLog(`[IRYS FUND WARNING] ${window.sanitizeForDOM(feMsg)} — กำลังตรวจสอบยอดเงินอีกครั้งก่อนสรุปว่าล้มเหลวจริง (ไม่ต้องกดซ้ำตอนนี้)`, "text-yellow-500");
            }
            
            window.appendLog(fundCallFailed
                ? "Funding TX status uncertain (bundler notify failed). Verifying on-chain balance before giving up..."
                : "Funding TX confirmed on-chain. Awaiting Bundler synchronization...", "text-yellow-400");
            window.updateBridgeStatus("SYNCING BUNDLER...", "warning");

            const titleEl = document.getElementById('fundOverlayTitle');
            const subEl = document.getElementById('fundOverlaySub');
            if(titleEl) titleEl.textContent = "SYNCING BUNDLER...";
            if(subEl) subEl.innerHTML = "กำลังตรวจสอบยอดเงินเข้า Irys Node...<br><span class='text-emerald-400'>(ใช้เวลาประมาณ 10-45 วินาที กรุณาอย่าปิดหน้านี้หรือกดเติมเงินซ้ำ)</span>";

            let isSynced = false;
            let attempts = 0;
            const maxAttempts = fundCallFailed ? 30 : 15;
            
            while (!isSynced && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                const currentBalance = await window.withNetworkRetry(() => window.irys.getLoadedBalance());
                if (currentBalance.isGreaterThan(initialBalance)) {
                    isSynced = true;
                }
                attempts++;
            }

            window.hideFundingOverlay();

            if (!isSynced) {
                if (fundCallFailed) {
                    throw new Error("ตรวจสอบยอดเงินแล้วยังไม่พบว่าเข้าระบบ — กรุณาอย่ากดเติมเงินซ้ำทันที ให้เช็คยอด ETH ที่ถูกหักในกระเป๋าก่อน แล้วลองใหม่อีกครั้งในอีกสักครู่ (เก็บ error id ไว้ถ้าต้องติดต่อฝ่ายซัพพอร์ตของ Irys)");
                }
                throw new Error("Bundler synchronization timeout. Please retry upload in a few minutes.");
            }
            
            window.appendLog("Bundler synchronized successfully. Proceeding to upload.", "text-emerald-400");
        }

        window.updateBridgeStatus("STREAMING PAYLOAD...", "warning");
        let receipt;
        if (isFile) {
            const env = window.detectUploadEnvironment();
            if (progressCtrl) progressCtrl.show(); 
            
            // [FIX 2] ปัญหาการบังคับหั่นไฟล์ขนาดเล็ก: ถ้าไฟล์เล็กกว่า 5MB ให้ใช้การอัปโหลดรวดเดียว
            if (payload.size <= 5 * 1024 * 1024) {
                window.appendLog(`Optimized Direct Upload: ขนาดไฟล์เหมาะสม (<5MB) กำลังอัปโหลด...`, "text-blue-400");
                const arrayBuffer = await payload.arrayBuffer();
                receipt = await window.irys.upload(new Uint8Array(arrayBuffer), { tags });
            } else {
                window.appendLog(`Chunked Upload Protocol: กำลังหั่นไฟล์เป็นส่วนๆ (ขนาด >5MB)`, "text-blue-400");
                receipt = await window.uploadWithRetry(payload, tags, env, progressCtrl || { set:()=>{}, complete:()=>{} });
            }
            
            if (progressCtrl) progressCtrl.complete();
        } else {
            receipt = await window.irys.upload(payload, { tags });
        }
        window.updateBridgeStatus("PERMANENTLY ONLINE", "success");
        return receipt;
    };


    window.executeIrysTopUp = async function(amountEthStr) {
        if (!window.lockSystem()) return; 
        const msSinceLastFund = Date.now() - lastFundAttemptAt;
        if (msSinceLastFund < FUND_COOLDOWN_MS) {
            const waitSec = Math.ceil((FUND_COOLDOWN_MS - msSinceLastFund) / 1000);
            window.showNotification(`กรุณารออีก ${waitSec} วินาทีก่อนเติมเงินรอบใหม่ (กันเสียเงินซ้ำจากธุรกรรมก่อนหน้าที่อาจยังไม่เข้าระบบ)`, "warning");
            window.unlockSystem();
            return;
        }
        try {
            await window.ensureIrysReady();
            
            const initialBalance = await window.irys.getLoadedBalance();
            lastFundAttemptAt = Date.now();
            
            const amountWei = ethers.parseEther(amountEthStr);
            
            window.showFundingOverlay(amountEthStr);
            window.appendLog(`Initiating Irys Top-up: ${amountEthStr} ETH...`, "text-blue-400");
            
            let fundCallFailed = false;
            try {
                // เพิ่มการตรวจสอบ 0 ETH สำหรับระบบ TopUp ไว้ด้วยเช่นกัน
                if (amountWei > 0n) {
                    await window.irys.fund(amountWei.toString());
                } else {
                    throw new Error("ยอดเติมเงินต้องมากกว่า 0");
                }
            } catch (fundErr) {
                const feMsg = (fundErr && fundErr.message) || "";
                const isUserRejection = /user rejected|declined|denied|cancelled|user declined/i.test(feMsg);
                if (isUserRejection) {
                    // [FIX 1] นำมาประยุกต์ใช้กับฟังก์ชัน TopUp ด้วย
                    lastFundAttemptAt = 0; 
                    throw fundErr; 
                }
                fundCallFailed = true;
                window.appendLog(`[IRYS FUND WARNING] ${window.sanitizeForDOM(feMsg)} — กำลังตรวจสอบยอดเงินอีกครั้งก่อนสรุปว่าล้มเหลวจริง (ไม่ต้องกดซ้ำตอนนี้)`, "text-yellow-500");
            }
            
            const titleEl = document.getElementById('fundOverlayTitle');
            const subEl = document.getElementById('fundOverlaySub');
            if(titleEl) titleEl.textContent = "SYNCING BUNDLER...";
            if(subEl) subEl.innerHTML = "กำลังตรวจสอบยอดเครดิตของคุณ...<br><span class='text-emerald-400'>(ใช้เวลาประมาณ 10-45 วินาที กรุณาอย่ากดเติมเงินซ้ำ)</span>";

            let isSynced = false;
            let attempts = 0;
            const maxTopUpAttempts = fundCallFailed ? 30 : 15; 
            
            while (!isSynced && attempts < maxTopUpAttempts) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                const currentBalance = await window.irys.getLoadedBalance();
                if (currentBalance.isGreaterThan(initialBalance)) {
                    isSynced = true;
                }
                attempts++;
            }
            
            window.hideFundingOverlay();
            
            if (isSynced) {
                window.showNotification(`เติมเครดิตเข้า Irys สำเร็จ! คุณสามารถอัปโหลดไฟล์ได้ทันทีโดยไม่ต้องเซ็นกระเป๋าอีก`, "success");
                window.appendLog(`Irys balance topped up successfully.`, "text-emerald-400");
            } else if (fundCallFailed) {
                window.showNotification(`ไม่แน่ใจว่าเติมเงินสำเร็จหรือไม่ (bundler แจ้ง error) — กรุณาอย่ากดเติมเงินซ้ำตอนนี้ เช็คยอด ETH ในกระเป๋าก่อน แล้วลองใหม่อีกครั้งในอีกสักครู่`, "warning");
                window.appendLog(`Top-up status uncertain after fund() error — please verify wallet balance before retrying.`, "text-yellow-500");
            } else {
                window.showNotification(`เติมเงินสำเร็จ แต่ระบบกำลังซิงค์ยอด กรุณารอสักครู่`, "warning");
            }
            
        } catch (err) {
            window.hideFundingOverlay();
            const msg = err.message || "Unknown error";
            if (msg.includes("declined") || msg.includes("rejected") || msg.includes("cancelled") || msg.includes("user rejected")) {
                window.appendLog("User cancelled the top-up transaction.", "text-yellow-500");
                window.showNotification("ยกเลิกการเติมเครดิต", "warning");
            } else {
                window.appendLog(`Top-up Failed: ${msg}`, "text-red-500");
                window.showNotification(`Top-up Failed: ${msg}`, "error");
            }
        } finally {
            window.unlockSystem(); 
        }
    };

    window.detectUploadEnvironment = function() {
        const ua = navigator.userAgent || "";
        const platform = navigator.platform || "";
        const isIOS = /iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isAndroid = /Android/i.test(ua);
        const isMobile = isIOS || isAndroid || /Mobi|Mobile/i.test(ua);
        const deviceMemory = navigator.deviceMemory || (isMobile ? 2 : 8);

        let chunkSize, batchSize;
        if (isIOS) {
            chunkSize = 2 * 1024 * 1024;   
            batchSize = 1;
        } else if (isMobile || deviceMemory <= 4) {
            chunkSize = 2 * 1024 * 1024;   
            batchSize = 2;
        } else {
            chunkSize = 5 * 1024 * 1024;   
            batchSize = 3;
        }
        return { isIOS, isAndroid, isMobile, deviceMemory, chunkSize, batchSize };
    };

    window.createProgressController = function(totalBytes) {
        const shell = document.getElementById('uploadProgressShell');
        const fill = document.getElementById('uploadProgressFill');
        const label = document.getElementById('uploadProgressLabel');
        let lastPaint = 0;
        let pct = 0;

        function paint(force) {
            const now = performance.now();
            if (!force && now - lastPaint < 400) return;
            lastPaint = now;
            if (fill) fill.style.width = pct + '%';
            if (label) label.textContent = pct + '%';
            if (shell) shell.setAttribute('aria-valuenow', String(pct));
        }
        return {
            show: () => { if (shell) shell.classList.remove('hidden'); paint(true); },
            set: (uploadedBytes) => {
                if (!totalBytes) return;
                const next = Math.min(100, Math.round((uploadedBytes / totalBytes) * 100));
                if (next !== pct) { pct = next; paint(false); }
            },
            complete: () => { pct = 100; paint(true); },
            hide: () => {
                if (shell) shell.classList.add('hidden');
                if (fill) fill.style.width = '0%';
                if (label) label.textContent = '0%';
            }
        };
    };

    window.uploadWithRetry = async function(file, tags, env, progress, maxRetries = 4) {
        let attempt = 0;
        let lastErr;
        
        while (attempt <= maxRetries) {
            const uploader = window.irys.uploader.chunkedUploader;
            
            try { if (typeof uploader.setChunkSize === 'function') uploader.setChunkSize(env.chunkSize); } catch (e) {}
            try { if (typeof uploader.setBatchSize === 'function') uploader.setBatchSize(env.batchSize); } catch (e) {}

            const onChunk = (info) => {
                try { progress.set(info && (info.totalUploaded ?? info.offset) || 0); } catch (e) {}
            };
            try { uploader.on && uploader.on('chunkUpload', onChunk); } catch (e) {}

            try {
                const response = await uploader.uploadFile(file, { 
                    chunkSize: env.chunkSize, 
                    batchSize: env.batchSize, 
                    tags 
                });
                progress.complete();
                return response;
            } catch (err) {
                lastErr = err;
                const msg = (err && err.message ? err.message : String(err)).toLowerCase();
                const isUserAbort = msg.includes('declined') || msg.includes('rejected by user') || msg.includes('user denied');
                if (isUserAbort) throw err;
                
                attempt++;
                if (attempt > maxRetries) break;
                
                const backoff = Math.min(8000, 1000 * Math.pow(2, attempt - 1));
                window.appendLog(`[NETWORK] Throttling detected. Retrying chunk in ${backoff/1000}s (Attempt ${attempt}/${maxRetries})...`, "text-amber-400");
                await new Promise(r => setTimeout(r, backoff));
            } finally {
                try { uploader.off && uploader.off('chunkUpload', onChunk); } catch (e) {}
            }
        }
        throw lastErr;
    };

    window.evaluateIosSafeguard = function(env, file, isVideo) {
        if (!env.isIOS) return { ok: true };
        const IOS_VIDEO_SOFT_LIMIT = 150 * 1024 * 1024; 
        if (isVideo && file.size > IOS_VIDEO_SOFT_LIMIT) {
            return {
                ok: false,
                message: `iOS Safari memory constraint: video payloads above ~150MB risk an out-of-memory tab crash. Please upload from a desktop browser, or compress the clip below 150MB.`
            };
        }
        return { ok: true };
    };

    window.isMemoryCeilingError = function(err) {
        const m = (err && err.message ? err.message : String(err)).toLowerCase();
        return m.includes('fetch') || m.includes('load failed') || m.includes('out of memory') ||
               m.includes('allocation') || m.includes('quota');
    };

    // [3] SECURITY VALIDATION: ตรวจสอบ Magic Number ระดับไบต์
    window.verifyMediaSignature = async function(file, expectedType) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = (e) => {
                const arr = new Uint8Array(e.target.result);
                const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
                
                if (expectedType === 'video') {
                    // ตรวจหา Signature ของวิดีโอ (MP4: ftyp, WebM: 1a45dfa3, MOV: moov/mdat)
                    const isVideo = hex.includes('66747970') || hex.startsWith('1a45dfa3') || hex.includes('6d6f6f76');
                    resolve(isVideo);
                } else {
                    // ตรวจหา Signature ของภาพ (JPEG, PNG, GIF, WebP)
                    const isImage = hex.startsWith('ffd8ff') || hex.startsWith('89504e47') || hex.startsWith('47494638') || hex.includes('57454250');
                    resolve(isImage);
                }
            };
            reader.onerror = () => resolve(false);
            reader.readAsArrayBuffer(file.slice(0, 16)); // ตรวจจับแค่ 16 Bytes แรกก็เพียงพอ
        });
    };

    window.processDeedUploadAssignment = async function(event) {
        if (!window.lockSystem()) return; 

        const file = event.target.files[0];
        const targetSlotAtInit = window.activeTargetDeedUploadSlot;
        if (!file || targetSlotAtInit === null) { window.unlockSystem(); return; }
        
        // --- ระบบบังคับเชื่อมต่ออัตโนมัติ (แก้ไข Deadlock แล้ว) ---
        try {
            await window.ensureIrysReady();
        } catch (e) {
            window.unlockSystem();
            return;
        }
        // ----------------------------------------------------
        
        let irysTxId = ""; 
        const maxByteSize = 300 * 1024 * 1024; 
        if (file.size > maxByteSize) {
            window.appendLog(`Payload rejected: ${window.sanitizeForDOM(file.name)} exceeds explicit 300 MB maximum constraints.`, "text-red-500 font-bold");
            window.showNotification("Structural exception: Upload payload sizes are strictly confined below the 300 MB threshold.", "error");
            event.target.value = "";
            window.unlockSystem();
            return;
        }

        let userIntentType = 'image';
        if (window.irysTargetFieldType === 'front') {
            const frontSelection = document.querySelector('input[name="frontType"]:checked');
            if (frontSelection) userIntentType = frontSelection.value;
        } else if (window.irysTargetFieldType === 'back') {
            const backSelection = document.querySelector('input[name="backType"]:checked');
            if (backSelection) userIntentType = backSelection.value;
        } else if (window.irysTargetFieldType === 'video') {
            userIntentType = 'video';
        }

        // [3] ประยุกต์ใช้ File Signature Verification ปิดการหลอกนามสกุลไฟล์
        const isAuthentic = await window.verifyMediaSignature(file, userIntentType);
        if (!isAuthentic) {
            window.appendLog(`SECURITY ALERT: โครงสร้างไฟล์ ${window.sanitizeForDOM(file.name)} ระดับไบต์ไม่ตรงกับประเภท ${userIntentType.toUpperCase()} ที่ระบุ ป้องกันการสอดไส้ Payload`, "text-red-500 font-bold");
            window.showNotification("SECURITY EXCEPTION: ตรวจพบการปลอมแปลงรูปแบบไฟล์ (File Signature Mismatch)", "error");
            event.target.value = "";
            window.unlockSystem();
            return;
        }

        if (userIntentType === 'video') {
            const videoDataUrl = URL.createObjectURL(file);
            const videoHelper = document.createElement('video');
            videoHelper.preload = 'metadata';
            videoHelper.muted = true; 
            videoHelper.playsInline = true; 
            
            let timeoutId;
            const isValidDuration = await Promise.race([
                new Promise((resolve) => {
                    videoHelper.onloadedmetadata = function() { 
                        if (!isFinite(videoHelper.duration) || isNaN(videoHelper.duration)) {
                            resolve(false);
                        } else {
                            resolve(videoHelper.duration <= 60.5); 
                        }
                    };
                    videoHelper.onerror = function() { resolve(false); };
                    videoHelper.src = videoDataUrl;
                    // [FIX 3] บังคับให้เบราว์เซอร์เริ่มดึงเนื้อหา Media เพื่อแก้ปัญหา onloadedmetadata ไม่ทำงานบนมือถือ
                    videoHelper.load(); 
                }),
                new Promise((resolve) => {
                    timeoutId = setTimeout(() => { resolve(false); }, 8000); 
                })
            ]).finally(() => {
                clearTimeout(timeoutId); 
                videoHelper.removeAttribute('src'); 
                videoHelper.load();
                URL.revokeObjectURL(videoDataUrl); 
                videoHelper.remove(); 
            });

            if (!isValidDuration) {
                window.appendLog(`Payload rejected: Portrait chronograph loop spans longer than 60 seconds or metadata is corrupted.`, "text-red-500 font-bold");
                window.showNotification("Structural exception: Personal vertical branding chronographs must resolve under a 60-second limit and possess valid metadata.", "error");
                event.target.value = "";
                window.unlockSystem();
                return;
            }
        }

        const env = window.detectUploadEnvironment();
        const guard = window.evaluateIosSafeguard(env, file, userIntentType === 'video');
        if (!guard.ok) {
            window.appendLog(`Payload blocked by iOS safe-guard: ${window.sanitizeForDOM(guard.message)}`, "text-red-500 font-bold");
            window.showNotification(window.sanitizeForDOM(guard.message), "error");
            event.target.value = "";
            window.unlockSystem();
            return;
        }

        const progress = window.createProgressController(file.size);
        window.appendLog(`Committing source file ${window.sanitizeForDOM(file.name)} via Adaptive Chunking Protocol to Irys Datachain...`, "text-blue-400");
        
        try {
            window.updateBridgeStatus(`NODE #${targetSlotAtInit}: MEASURING SETTLEMENT FEES...`, "warning");
            const tags = [{ name: "Content-Type", value: file.type }];
            const response = await window.executeIrysUpload(file, tags, true, progress);
            irysTxId = response.data ? response.data.id : response.id;
            
            window.appendLog(`Payload anchored permanently. Irys TXID: ${window.sanitizeForDOM(irysTxId)}`, "text-emerald-400 font-bold");
            window.updateBridgeStatus(`NODE #${targetSlotAtInit}: PERMANENTLY ONLINE`, "success");
            
            const isStillOnSameNode = (String(targetSlotAtInit) === String(window.globalSelectedTokenId));
            const finalIrysUrl = window.buildIrysUrl(irysTxId);
            
            const card = document.getElementById('sovereignFlipCard');
            
            if (isStillOnSameNode) {
                if (window.irysTargetFieldType === 'front') {
                    const elF = document.getElementById('forgeFrontUri'); if(elF) elF.value = irysTxId;
                    const elT = document.getElementById('novaTokenId'); if(elT) elT.value = targetSlotAtInit;
                    window.renderToViewport('previewFrontContainer', finalIrysUrl, "", userIntentType);
                    window.currentLoadedMediaData.front = irysTxId;
                    window.currentLoadedMediaData.frontType = userIntentType;
                    if (card) card.classList.remove('flipped');
                } else if (window.irysTargetFieldType === 'video') {
                    const elV = document.getElementById('novaVideoUri'); if(elV) elV.value = irysTxId;
                    const elT = document.getElementById('novaTokenId'); if(elT) elT.value = targetSlotAtInit;
                    window.renderToViewport('previewFrontContainer', finalIrysUrl, "", "video");
                    window.currentLoadedMediaData.video = irysTxId;
                    if (card) card.classList.remove('flipped');
                } else if (window.irysTargetFieldType === 'back') {
                    const elB = document.getElementById('forgeBackUri'); if(elB) elB.value = irysTxId;
                    window.renderToViewport('previewBackContainer', finalIrysUrl, "", userIntentType);
                    window.currentLoadedMediaData.back = irysTxId;
                    window.currentLoadedMediaData.backType = userIntentType;
                    if (card) card.classList.add('flipped');
                }
            } else {
                window.appendLog(`Notice: Node changed during upload. Uploaded Irys TXID (${window.sanitizeForDOM(irysTxId)}) is safely retained in Datachain but not applied to current inputs.`, "text-yellow-500 font-bold");
            }
            
            progress.complete();
            window.showNotification(`Upload Success: ไฟล์ถูกบันทึกลง Irys Datachain สำเร็จ`, "success");
        } catch (err) {
            const errorMsg = typeof window.decodeContractError === 'function' ? window.decodeContractError(err) : (err.message || "Unknown Error");
            const sanitizedMsg = window.sanitizeForDOM(errorMsg);

            if (sanitizedMsg === "USER_CANCELLED_TX" || err.message?.toLowerCase().includes("user declined")) {
                window.appendLog("Irys upload or wallet execution was aborted by the user.", "text-yellow-500");
                window.showNotification("การอัปโหลดหรือเติมเงินถูกยกเลิกโดยผู้ใช้", "warning");
            } else {
                window.appendLog(`Irys permanent transmission process faulted or canceled: ${sanitizedMsg}`, "text-red-500");
                window.updateBridgeStatus(`NODE #${targetSlotAtInit}: STREAM BROKEN`, "error");
                if (window.isMemoryCeilingError(err)) {
                    window.showNotification("Memory-ceiling failure detected. Try a smaller file.", "error");
                } else {
                    window.showNotification(`System Exception: ${sanitizedMsg}`, "error");
                }
            }
        } finally {
            progress.hide();
            event.target.value = "";
            window.unlockSystem(); 
        }
    };

    window.buildAndUploadMetadata = async function(e) {
        if (!window.lockSystem()) return;

        // --- ระบบบังคับเชื่อมต่ออัตโนมัติ (แก้ไข Deadlock แล้ว) ---
        try {
            await window.ensureIrysReady();
        } catch (err) {
            window.unlockSystem();
            return;
        }
        // ----------------------------------------------------

        const btn = window.toggleButtonLoading(e, true);
        try {
            const rootNameInput = document.getElementById('propName');
            const rootName = (rootNameInput && rootNameInput.value.trim() !== "") 
                             ? rootNameInput.value.trim() 
                             : "THE IMPERIAL SOVEREIGNTY DEED";

            const dynamicAttributes = []; 

            for (let i = 1; i <= 7; i++) {
                const keyInput = document.getElementById(`propKey${i}`);
                const valInput = document.getElementById(`prop${i}`);
                
                const key = typeof window.sanitizeForJSON === 'function' ? window.sanitizeForJSON(keyInput ? keyInput.value : "") : (keyInput ? keyInput.value : "");
                const val = typeof window.sanitizeForJSON === 'function' ? window.sanitizeForJSON(valInput ? valInput.value : "") : (valInput ? valInput.value : "");

                if (key !== "" && val !== "") {
                    dynamicAttributes.push({ trait_type: key, value: val });
                }
            }

            const frontUri = document.getElementById('forgeFrontUri')?.value.trim() || (window.currentLoadedMediaData.front || "");
            const backUri = document.getElementById('forgeBackUri')?.value.trim() || (window.currentLoadedMediaData.back || "");
            const videoUri = document.getElementById('novaVideoUri')?.value.trim() || (window.currentLoadedMediaData.video || "");
            
            if (typeof window.isMaliciousURI === 'function' && (window.isMaliciousURI(frontUri) || window.isMaliciousURI(backUri) || window.isMaliciousURI(videoUri))) {
                throw new Error("Malicious Payload detected in URIs. Operation aborted.");
            }

            const frontTypeElement = document.querySelector('input[name="frontType"]:checked');
            const backTypeElement = document.querySelector('input[name="backType"]:checked');
            
            const frontType = frontTypeElement ? frontTypeElement.value : "image";
            const backType = backTypeElement ? backTypeElement.value : "image";

            const metadata = {
                name: rootName,
                description: "IMPERIAL SOVEREIGN ARCHITECTURE - Absolute Immutable Autarkic Identity Manifest",
                attributes: dynamicAttributes
            };

            if (frontUri) {
                const finalFrontUrl = window.buildIrysUrl(frontUri);
                if (frontType === "video") {
                    metadata.animation_url = finalFrontUrl;
                    metadata.image = finalFrontUrl; 
                } else {
                    metadata.image = finalFrontUrl;
                }
            }

            if (backUri) {
                metadata.properties = {
                    reverse_deed: {
                        type: backType,
                        uri: window.buildIrysUrl(backUri),
                        unlocked: true
                    }
                };
            }

            if (videoUri) {
                metadata.animation_url = window.buildIrysUrl(videoUri);
            }

            const dataToUpload = JSON.stringify(metadata);
            
            const tags = [{ name: "Content-Type", value: "application/json" }];
            window.updateBridgeStatus(`SEALING ARCHITECT'S MANIFEST UNTO THE LEDGER...`, "warning");
            window.appendLog(`Dynamic metadata strictly formatted for OpenSea compatibility. Sealing payload...`, "text-yellow-400");
            
            const receipt = await window.executeIrysUpload(dataToUpload, tags, false);
            const irysTxId = receipt.id;
            
            window.appendLog(`Metadata completely sealed. Mapping pathway straight to NOVA protocol input (Irys ID: ${window.sanitizeForDOM(irysTxId)})`, "text-emerald-400 font-bold");
            window.updateBridgeStatus(`METADATA SCHEMATIC ONLINE`, "success");
            
            const hiddenInput = document.getElementById('novaHiddenInput');
            if(hiddenInput) {
                hiddenInput.value = irysTxId;
                hiddenInput.classList.add('border-emerald-500', 'bg-emerald-900/20');
                setTimeout(() => hiddenInput.classList.remove('border-emerald-500', 'bg-emerald-900/20'), 2500);
            }
        } catch(err) {
            const errorMsg = typeof window.decodeContractError === 'function' ? window.decodeContractError(err) : (err.message || "Unknown Error");
            const sanitizedMsg = window.sanitizeForDOM(errorMsg);

            if (err.code === 4001 || sanitizedMsg === "USER_CANCELLED_TX" || err.message?.toLowerCase().includes("user rejected") || err.message?.toLowerCase().includes("denied transaction") || err.message?.toLowerCase().includes("declined")) {
                window.appendLog("Metadata registration funding sequence aborted by user.", "text-yellow-500");
                window.showNotification("การเติมเงินอัปโหลดเจตจำนงถูกยกเลิก", "warning");
            } else {
                window.appendLog(`Metadata compilation aborted: ${sanitizedMsg}`, "text-red-500");
                window.showNotification(sanitizedMsg, "error");
            }
        } finally {
            window.unlockSystem();
            if(btn) window.toggleButtonLoading(btn, false);
        }
    };

    window.guessMediaType = function(uri) {
        if (!uri) return 'image';
        if (uri.match(/\.(mp4|webm|mov|avi|m4v|m3u8)$/i)) return 'video';
        return 'image';
    };

    window.renderToViewport = async function(containerId, path, defaultText, explicitMediaType = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (container._abortController) {
            container._abortController.abort();
        }

        const masterController = new AbortController();
        container._abortController = masterController;

        if (!path || path.trim() === "" || path === "undefined" || path === "null") {
            const span = document.createElement('span');
            span.className = "text-[8px] font-mono text-slate-500 text-center uppercase italic break-all p-1 block w-full h-full flex items-center justify-center";
            span.textContent = defaultText || "UNALLOCATED STRUCTURAL SPACE";
            container.replaceChildren();
            container.appendChild(span);
            return;
        }

        const safePath = path.trim();
        const isPermittedScheme = /^https?:\/\//i.test(safePath) || safePath.startsWith('ar://') || safePath.startsWith('irys://') || safePath.length === 43;
        
        if ((typeof window.isMaliciousURI === 'function' && window.isMaliciousURI(safePath)) || !isPermittedScheme) {
            const span = document.createElement('span');
            span.className = "text-[8px] font-mono text-red-500 text-center uppercase italic break-all p-1 block w-full h-full flex items-center justify-center";
            span.textContent = "⛔ BLOCKED: UNSAFE URI SCHEME REJECTED";
            container.replaceChildren();
            container.appendChild(span);
            return;
        }

        const skeleton = document.createElement('div');
        skeleton.className = "skeleton-loader absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900 rounded animate-pulse";
        const skeletonCircle = document.createElement('div');
        skeletonCircle.className = "w-8 h-8 rounded-full bg-slate-800 mb-3 shadow-[0_0_10px_rgba(255,255,255,0.05)]";
        const skeletonBar = document.createElement('div');
        skeletonBar.className = "w-1/2 h-2 bg-slate-800 rounded shadow-[0_0_10px_rgba(255,255,255,0.05)]";
        skeleton.appendChild(skeletonCircle);
        skeleton.appendChild(skeletonBar);
        
        container.replaceChildren();
        container.appendChild(skeleton);

        try {
            const mimeType = explicitMediaType ? explicitMediaType : window.guessMediaType(path);
            const finalIrysUrl = window.buildIrysUrl(safePath); 

            if (masterController.signal.aborted) return;
            
            window.renderMediaToDOM(container, finalIrysUrl, mimeType);

        } catch (e) {
            if (e.name === 'AbortError') return;
            const errSpan = document.createElement('span');
            errSpan.className = "text-[8px] font-mono text-red-500 flex items-center justify-center h-full w-full absolute top-0 left-0 bg-black/80 z-20";
            errSpan.textContent = "IRYS GATEWAY SEVERED";
            container.replaceChildren();
            container.appendChild(errSpan);
        }
    };

    window.renderMediaToDOM = function(container, finalUrl, mediaType) {
        if (container._hlsInstance) {
            container._hlsInstance.destroy();
            container._hlsInstance = null;
        }

        while (container.firstChild) {
            const child = container.firstChild;
            if (child.tagName === 'VIDEO' || child.tagName === 'IMG') {
                child.removeAttribute('src');
                if (child.tagName === 'VIDEO') child.load();
            }
            container.removeChild(child);
        }
        
        const isVideo = mediaType === 'video';
        const el = document.createElement(isVideo ? 'video' : 'img');
        
        el.className = 'w-full h-full object-cover p-1 rounded bg-black shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 relative opacity-0 transition-opacity duration-500';
        
        if (isVideo) {
            el.autoplay = true; 
            el.loop = true; 
            el.muted = true; 
            el.playsInline = true; 
            el.setAttribute('webkit-playsinline', 'true');
            el.preload = 'auto'; 
            el.crossOrigin = 'anonymous';
            
            if (finalUrl.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
                const hls = new Hls({ maxBufferLength: 30, maxMaxBufferLength: 600 });
                container._hlsInstance = hls; 
                hls.loadSource(finalUrl);
                hls.attachMedia(el);
                hls.on(Hls.Events.MANIFEST_PARSED, () => { el.play().catch(()=>{}); });
            } else {
                el.src = finalUrl;
            }
            el.oncanplay = () => el.classList.remove('opacity-0');
        } else {
            el.src = finalUrl;
            el.onload = () => el.classList.remove('opacity-0');
        }
        
        el.onerror = () => { 
            while (container.firstChild) {
                const child = container.firstChild;
                if (child.tagName === 'VIDEO' || child.tagName === 'IMG') {
                    child.removeAttribute('src');
                    if (child.tagName === 'VIDEO') child.load();
                }
                container.removeChild(child);
            }
            const errSpan = document.createElement('span');
            errSpan.className = "text-[8px] font-mono text-red-500 flex items-center justify-center h-full z-10 relative";
            errSpan.textContent = "ARTIFACT CORRUPTED";
            container.appendChild(errSpan);
        };
        container.appendChild(el);
    };

})();