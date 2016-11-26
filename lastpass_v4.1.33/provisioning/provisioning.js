/* globals g_local_key: false */
/* globals g_local_key_hash: false */
/* globals g_local_key_hex: false */
	
var Provisioning;
(function (Provisioning) {
    'use strict';
    var ProvisioningService = (function () {
        function ProvisioningService(platform, global) {
            this.platform = platform;
            this.global = global;
        }
        ProvisioningService.prototype.checkUserState = function (callback) {
            if (!this.global.lploggedin && this.global.shouldOpenLogin4_0()) {
                callback({ error: "User is not logged in." });
                this.platform.openLoginPopover();
            }
            else {
                callback({ result: "OK." });
            }
        };
        ProvisioningService.prototype.sendApiCalls = function (url, options, callback) {
            var _this = this;
            this.platform.openTab({
                url: this.urlToCall(url),
                inactive: true,
                loadHandler: function (tab) {
                    var ajaxSettings = {
                        global: false,
                        type: options.action_type || 'GET',
                        cache: false,
                        url: options.url,
                        data: options.params,
                        success: function (data) {
                            _this.handleResponseFromThridParty(tab, callback, data);
                        },
                        error: function (xhr, errorText, errorObject) {
                            _this.handleResponseFromThridParty(tab, callback, { error: errorText });
                        }
                    };
                    if (options.header) {
                        ajaxSettings.headers = {};
                        for (var i = 0; i < options.header.length; i++) {
                            ajaxSettings.headers[options.header[i].key] = options.header[i].value;
                        }
                    }
                    if (options.dataType !== 'json') {
                        var params = [];
                        for (var key in options.data) {
                            params.push(key + '=' + encodeURIComponent(options.data[key]));
                        }
                        ajaxSettings.data = params.join('&');
                    }
                    else {
                        ajaxSettings.data = JSON.stringify(options.data);
                    }
                    tab.getTop().jQuery.ajax(ajaxSettings);
                    _this.cstimeout = setTimeout(function () {
                        _this.handleResponseFromThridParty(tab, callback, { error: 'timeout' });
                    }, 10000);
                }
            });
        };
        ProvisioningService.prototype.handleResponseFromThridParty = function (tab, callback, result) {
            clearTimeout(this.cstimeout);
            callback(result);
            tab.close();
        };
        ProvisioningService.prototype.getLocalKey = function (callback) {
            callback({
                key: g_local_key,
                hash: g_local_key_hash,
                hex: g_local_key_hex
            });
        };
        ProvisioningService.prototype.urlToCall = function (data) {
            var a = document.createElement('a');
            a.href = data;
            return a.origin;
        };
        return ProvisioningService;
    }());
    Provisioning.ProvisioningService = ProvisioningService;
    Provisioning.provisioning = new ProvisioningService(LPPlatform, window);
})(Provisioning || (Provisioning = {}));
