var map = function (obj, iterator) {
    var results = []
    // Not using strict equality so that this acts as a
    // shortcut to checking for `null` and `undefined`.
    if (obj == null) {
        return results
    }
    if (Array.prototype.map && obj.map === Array.prototype.map) { return obj.map(iterator) }
    each(obj, function (value, index, list) {
        results.push(iterator(value, index, list))
    })
    return results
}

var getRegularPlugins = function (options) {
    if (navigator.plugins == null) {
        return options.NOT_AVAILABLE
    }

    var plugins = []
    // plugins isn't defined in Node envs.
    for (var i = 0, l = navigator.plugins.length; i < l; i++) {
        if (navigator.plugins[i]) { plugins.push(navigator.plugins[i]) }
    }

    // sorting plugins only for those user agents, that we know randomize the plugins
    // every time we try to enumerate them
    if (pluginsShouldBeSorted(options)) {
        plugins = plugins.sort(function (a, b) {
            if (a.name > b.name) { return 1 }
            if (a.name < b.name) { return -1 }
            return 0
        })
    }
    return map(plugins, function (p) {
        var mimeTypes = map(p, function (mt) {
            return [mt.type, mt.suffixes]
        })
        return [p.name, p.description, mimeTypes]
    })
}
var getIEPlugins = function (options) {
    var result = []
    if ((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, 'ActiveXObject')) || ('ActiveXObject' in window)) {
        var names = [
            'AcroPDF.PDF', // Adobe PDF reader 7+
            'Adodb.Stream',
            'AgControl.AgControl', // Silverlight
            'DevalVRXCtrl.DevalVRXCtrl.1',
            'MacromediaFlashPaper.MacromediaFlashPaper',
            'Msxml2.DOMDocument',
            'Msxml2.XMLHTTP',
            'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
            'QuickTime.QuickTime', // QuickTime
            'QuickTimeCheckObject.QuickTimeCheck.1',
            'RealPlayer',
            'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
            'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
            'Scripting.Dictionary',
            'SWCtl.SWCtl', // ShockWave player
            'Shell.UIHelper',
            'ShockwaveFlash.ShockwaveFlash', // flash plugin
            'Skype.Detection',
            'TDCCtl.TDCCtl',
            'WMPlayer.OCX', // Windows media player
            'rmocx.RealPlayer G2 Control',
            'rmocx.RealPlayer G2 Control.1'
        ]
        // starting to detect plugins in IE
        result = map(names, function (name) {
            try {
                // eslint-disable-next-line no-new
                new window.ActiveXObject(name)
                return name
            } catch (e) {
                return options.ERROR
            }
        })
    } else {
        result.push(options.NOT_AVAILABLE)
    }
    if (navigator.plugins) {
        result = result.concat(getRegularPlugins(options))
    }
    return result
}
var pluginsShouldBeSorted = function (options) {
    var should = false
    for (var i = 0, l = [/palemoon/i].length; i < l; i++) {
        var re = [/palemoon/i][i]
        if (navigator.userAgent.match(re)) {
            should = true
            break
        }
    }
    return should
}