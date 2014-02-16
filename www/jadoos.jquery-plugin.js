
jQuery.agwInit = function (account) {
    jQuery.agwAjax = function (options) {
        options.url = "https://" + account.getAAUID() + ".aauid.net" + options.url;
        if (options.method)
            options.type = options.method;

        if (!options.type || options.type == "GET") {
            if (options.url.indexOf('?') == -1)
                options.url = options.url + "?access_token=" + account.getBearerAccessToken();
            else
                options.url = options.url + "&access_token=" + account.getBearerAccessToken();
        } else if (options.type == "POST" && !options.contentType && (!options.data || (typeof options.data) == 'object')) {
            options.data = options.data || {};
            options.data['access_token'] = account.getBearerAccessToken();
        } else {
            options.headers = options.headers || [];
            options.headers["Authorization"] = "Bearer " + account.getBearerAccessToken();
        }

        jQuery.ajax(options);
    };
};
