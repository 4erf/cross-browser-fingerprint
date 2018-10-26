var ip_address = "192.168.0.167";

function getResolution() {
    var zoom_level = detectZoom.device();
    var fixed_width = window.screen.width * zoom_level;
    var fixed_height = window.screen.height * zoom_level;
    var res = Math.round(fixed_width) + '_' + Math.round(fixed_height) + '_' + zoom_level + '_' + window.screen.width + "_" + window.screen.height + "_" + window.screen.colorDepth + "_" + window.screen.availWidth + "_" + window.screen.availHeight + "_" + window.screen.left + '_' + window.screen.top + '_' + window.screen.availLeft + "_" + window.screen.availTop + "_" + window.innerWidth + "_" + window.outerWidth + "_" + detectZoom.zoom();
    return res;
}

function isIE() {
    if (navigator.appName === 'Microsoft Internet Explorer') {
        return true
    } else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) { // IE 11
        return true
    }
    return false
}

var Sender = function () {
    this.postData = {
        WebGLFp: "Undefined",
        WebGLVendor: "Undefined",
        WebGLExtensions: "Undefined",
        timezone: "Undefined",
        timezoneOffset: "Undefined",
        resolution: "Undefined",
        plugins: "Undefined",
        canvas: "Undefined",
        memory: "Undefined",
        audioBrowser: "Undefined"
    };

    this.sendData =
        function (audio) {
            var webGLFp = getWebglFp();
            this.postData['WebGLFp'] = webGLFp[0];
            webGLFp.shift();
            this.postData['WebGLExtensions'] = JSON.stringify(webGLFp);
            this.postData['WebGLVendor'] = getWebglVendorAndRenderer();
            this.postData['canvas'] = CanvasTest();

            this.postData['audioBrowser'] = audio;

            this.postData['timezoneOffset'] = new Date().getTimezoneOffset();
            if (window.Intl && window.Intl.DateTimeFormat) {
                this.postData['timezone'] = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
            };

            /**
             * this part is used for dected the real resolution
             */
            this.postData['resolution'] = getResolution();

            if (isIE()) {
                this.postData['plugins'] = getIEPlugins();
            } else {
                this.postData['plugins'] = getRegularPlugins();
            }

            this.postData['plugins'] = JSON.stringify(this.postData['plugins']);

            this.postData['memory'] = navigator.deviceMemory || "Undefined";

            $('#status').html("Waitting for the server...");
            console.log(this.postData);
            startSend(this.postData);

            function startSend(postData) {
                parent.$('body').trigger('resolveSingle', [postData]);
            }

        }
};

/* Converts the charachters that aren't UrlSafe to ones that are and
   removes the padding so the base64 string can be sent
   */
Base64EncodeUrlSafe = function (str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
};

stringify = function (array) {
    var str = "";
    for (var i = 0, len = array.length; i < len; i += 4) {
        str += String.fromCharCode(array[i + 0]);
        str += String.fromCharCode(array[i + 1]);
        str += String.fromCharCode(array[i + 2]);
    }

    // NB: AJAX requires that base64 strings are in their URL safe
    // form and don't have any padding
    var b64 = window.btoa(str);
    return Base64EncodeUrlSafe(b64);
};

Uint8Array.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length === 0)
        return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this[i];
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

var sender = new Sender;
audioFingerPrintingBrowser(function (res) {
    sender.sendData(res);
})