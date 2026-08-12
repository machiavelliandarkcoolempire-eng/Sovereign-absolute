// web3-polyfill.js
import { Buffer } from 'buffer';

(function installBaseGlobals() {
    if (typeof window !== 'undefined') {
        if (typeof window.global === 'undefined') window.global = window;
        window.Buffer = Buffer;
        if (typeof window.process === 'undefined') {
            window.process = {
                env: { NODE_ENV: "production" }, 
                browser: true, version: '', versions: { node: '' }, platform: 'browser',
                nextTick: function (cb) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    setTimeout(function () { cb.apply(null, args); }, 0);
                }
            };
        }
    }
})();