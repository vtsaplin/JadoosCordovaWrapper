var JadoosSDK;
(function (JadoosSDK) {
    (function (JdURNSchema) {
        JdURNSchema[JdURNSchema["Account"] = 0] = "Account";
        JdURNSchema[JdURNSchema["DomainResource"] = 1] = "DomainResource";
    })(JadoosSDK.JdURNSchema || (JadoosSDK.JdURNSchema = {}));
    var JdURNSchema = JadoosSDK.JdURNSchema;
    ;
    (function (JdURNType) {
        JdURNType[JdURNType["RootResource"] = 0] = "RootResource";
        JdURNType[JdURNType["NonRootResource"] = 1] = "NonRootResource";
        JdURNType[JdURNType["Account"] = 2] = "Account";
        JdURNType[JdURNType["AccountByQualifier"] = 3] = "AccountByQualifier";
    })(JadoosSDK.JdURNType || (JadoosSDK.JdURNType = {}));
    var JdURNType = JadoosSDK.JdURNType;
    ;

    var JdURN = (function () {
        function JdURN(urnString) {
            this.valid = false;
            var segments = urnString.split(':');
            if (segments[0] == "urn" && segments.length > 2) {
                if (segments[1] == "x-jd" && this._validateDomain(segments[2])) {
                    this.schema = 1 /* DomainResource */;

                    this.valid = true;
                    this.domain = segments[2].toLowerCase();
                    if (segments.length == 3) {
                        this.type = 0 /* RootResource */;
                    } else {
                        this.segments = segments.slice(3);
                        for (var s in this.segments) {
                            this.valid = this.valid && (this.segments[s].search(/^[A-Za-z\d-.]*$/) > -1);
                        }
                        this.type = 1 /* NonRootResource */;
                    }
                } else if (segments[1] == "x-jd-acct") {
                    this.schema = 0 /* Account */;
                    if (segments.length == 3 && segments[2].search(/^[a-z0-9]{16}$/) > -1) {
                        this.valid = true;
                        this.type = 2 /* Account */;
                        this.segments = segments.slice(2);
                    } else if (segments.length == 4 && segments[2].search(/^[a-z0-9]{16}$/) > -1 && segments[3].search(/^[A-Z]{2}$/) > -1) {
                        this.valid = true;
                        this.type = 3 /* AccountByQualifier */;
                        this.segments = segments.slice(2);
                    }
                }
            }
        }
        JdURN.prototype._validateDomain = function (domainName) {
            return (domainName.search(/^([a-z\d](-*[a-z\d])*)(\.([a-z\d](-*[a-z\d])*))+$/i) > -1 && domainName.search(/^.{1,253}$/) > -1 && domainName.search(/^[^\.]{1,63}(\.[^\.]{1,63})*$/) > -1);
        };

        JdURN.prototype.toString = function () {
            if (!this.isValid())
                return "";
            switch (this.schema) {
                case 0 /* Account */:
                    return "urn:x-jd-acct:" + this.getLocalPart();
                case 1 /* DomainResource */:
                    if (this.isRoot())
                        return "urn:x-jd:" + this.domain;
                    if (!this.isRoot())
                        return "urn:x-jd:" + this.domain + ":" + this.getLocalPart();
            }
        };

        JdURN.prototype.isValid = function () {
            return this.valid;
        };

        JdURN.prototype.isRoot = function () {
            return (this.type == 0 /* RootResource */);
        };

        JdURN.prototype.getDomain = function () {
            return this.domain;
        };

        JdURN.prototype.getType = function () {
            return this.type;
        };

        JdURN.prototype.getSchema = function () {
            return this.schema;
        };

        JdURN.prototype.getSegment = function (n) {
            return this.segments[n];
        };

        JdURN.prototype.getSegmentCount = function () {
            return this.segments.length;
        };

        JdURN.prototype.getLocalPart = function () {
            return this.segments.join(':');
        };

        JdURN.prototype.getAAUID = function () {
            if (this.getSchema() == 0 /* Account */)
                return this.segments[0];
            return null;
        };

        JdURN.prototype.getQualifier = function () {
            if (this.getType() == 3 /* AccountByQualifier */)
                return this.segments[1];
            return null;
        };
        return JdURN;
    })();
    JadoosSDK.JdURN = JdURN;

    var Account = (function () {
        function Account(urn, bearerAccessToken) {
            if (urn.isValid() && urn.getType() == 2 /* Account */) {
                this.urn = urn;
                this.bearerAccessToken = bearerAccessToken;
            }
        }
        Account.prototype.getJdURN = function () {
            return this.urn;
        };

        Account.prototype.getAAUID = function () {
            return this.urn.getAAUID();
        };

        Account.prototype.getBearerAccessToken = function () {
            return this.bearerAccessToken;
        };

        Account.prototype.setAccountDescriptor = function (accountDescriptor) {
            this.accountDescriptor = accountDescriptor;
            return this;
        };

        Account.prototype.getAccountDescriptor = function () {
            return this.accountDescriptor;
        };
        return Account;
    })();
    JadoosSDK.Account = Account;
})(JadoosSDK || (JadoosSDK = {}));
