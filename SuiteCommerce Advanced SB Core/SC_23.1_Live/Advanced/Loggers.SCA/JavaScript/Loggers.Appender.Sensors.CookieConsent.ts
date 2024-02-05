/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Loggers.Appender.Sensors.CookieConsent"/>

import Cookies = require('../../../Commons/Utilities/JavaScript/js.cookie');

interface CookieConsent {
    id: string;
    timestamp: number;
    consentSettings: CookieOptions;
}

export interface CookieConsentFormatted extends Omit<CookieConsent, 'consentSettings'> {
    consentSettings: string;
}

interface CookieOptions {
    (key: string): string;
}

export function cookieConsent(): CookieConsentFormatted {
    const consentCookie = Cookies.get('trackingConsentCookie');
    if (!consentCookie) {
        return null;
    }
    const decodedCookie: CookieConsent = decode(consentCookie);
    if (!decodedCookie.id || !decodedCookie.timestamp || !decodedCookie.consentSettings) {
        return null;
    }
    const cookieoptions = formatCookieOptions(decodedCookie.consentSettings);
    const shopperAnalyticsConsent = {
        id: decodedCookie.id,
        timestamp: decodedCookie.timestamp,
        consentSettings: cookieoptions
    };
    return shopperAnalyticsConsent;
}

function decode<T>(cookieData: string): T {
    return JSON.parse(atob(cookieData));
}

function formatCookieOptions(cookieOptions: CookieOptions): string {
    let options = [];
    Object.keys(cookieOptions).forEach((option => {
        options.push(option + '|' + (cookieOptions[option] ? 'T' : 'F'));
    }));
    return options.join(',');
}
