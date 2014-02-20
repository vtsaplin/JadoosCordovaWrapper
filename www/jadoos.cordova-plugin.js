var JadoosSDK = require('com.jadoos.phonegap.core'); 

var JadoosCordovaWrapper = function () {
    this.account = null;
    this.applicationUrn = null;
}

JadoosCordovaWrapper.prototype.hasAccount = function () {
    return (this.account != null);
};

JadoosCordovaWrapper.prototype.getAccount = function () {
    return this.account;
};

JadoosCordovaWrapper.prototype.getApplicationURN = function () {
    return this.applicationUrn;
};

JadoosCordovaWrapper.prototype._setAccountFromResponse = function (data) {
    var urn = new JadoosSDK.JdURN('urn:x-jd-acct:' + data['aauid']);
    this.account = new JadoosSDK.Account(urn, data['accessToken']);
};

JadoosCordovaWrapper.prototype.initialize = function (callback) {
    if (this.applicationUrn == null) {
        var jadoos = this;
        cordova.exec(function (data) {
            jadoos.applicationUrn = new JadoosSDK.JdURN(data['appUrn']);
            if (data['hasAccount'])
                jadoos._setAccountFromResponse(data);
            callback();
        }, callback, "JadoosWrapper", "initialize", []);
    }
};

JadoosCordovaWrapper.prototype.silentRegister = function (callback) {
    if (this.applicationUrn != null) {
        var jadoos = this;
        cordova.exec(function (data) {
            if (data['hasAccount'])
                jadoos._setAccountFromResponse(data);
            callback();
        }, callback, "JadoosWrapper", "silentRegister", []);
    }
};

module.exports = {
    CordovaWrapper: JadoosCordovaWrapper
};
