/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Loggers.Appender.Sensors.CookieConsent", ["require", "exports", "js.cookie"], function (require, exports, Cookies) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cookieConsent = void 0;
    function cookieConsent() {
        var consentCookie = Cookies.get('trackingConsentCookie');
        if (!consentCookie) {
            return null;
        }
        var decodedCookie = decode(consentCookie);
        if (!decodedCookie.id || !decodedCookie.timestamp || !decodedCookie.consentSettings) {
            return null;
        }
        var cookieoptions = formatCookieOptions(decodedCookie.consentSettings);
        var shopperAnalyticsConsent = {
            id: decodedCookie.id,
            timestamp: decodedCookie.timestamp,
            consentSettings: cookieoptions
        };
        return shopperAnalyticsConsent;
    }
    exports.cookieConsent = cookieConsent;
    function decode(cookieData) {
        return JSON.parse(atob(cookieData));
    }
    function formatCookieOptions(cookieOptions) {
        var options = [];
        Object.keys(cookieOptions).forEach((function (option) {
            options.push(option + '|' + (cookieOptions[option] ? 'T' : 'F'));
        }));
        return options.join(',');
    }
});

//# sourceMappingURL=Loggers.Appender.Sensors.CookieConsent.js.map
