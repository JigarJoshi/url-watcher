const { Ci, Cu, Cc, Cr } = require('chrome');
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/devtools/Console.jsm');

var observers = {
    'http-on-modify-request': {
        observe: function (aSubject, aTopic, aData) {
            var httpChannel = aSubject.QueryInterface(Ci.nsIHttpChannel);
            var requestUrl = httpChannel.URI.spec
            if ( requestUrl.indexOf('%E2%80%8B') != -1
             ||  requestUrl.indexOf('%E2%80%8C') != -1
             ||  requestUrl.indexOf('%E2%80%8D') != -1
             ||  requestUrl.indexOf('%EF%BB%BF') != -1
             ||  requestUrl.indexOf('​') != -1
             ||  requestUrl.indexOf('​') != -1
             ||  requestUrl.indexOf('‌') != -1
             ||  requestUrl.indexOf('‍') != -1) {
                   httpChannel.redirectTo(Services.io.newURI('data:text,url_blocked_because_of_zero_width_space_characters_presence', null, null));
            }
        },
        reg: function () {
            Services.obs.addObserver(observers['http-on-modify-request'], 'http-on-modify-request', false);
        },
        unreg: function () {
            Services.obs.removeObserver(observers['http-on-modify-request'], 'http-on-modify-request');
        }
    }
};

for (var o in observers) {
    observers[o].reg();
}

// unreg observers on uninstall, disable, shutdown, upgrade, downgrade
exports.onUnload = function (reason) {
 for (var o in observers) {
     observers[o].unreg();
 }
};
