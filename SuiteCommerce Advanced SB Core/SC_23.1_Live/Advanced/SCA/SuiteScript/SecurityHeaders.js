/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('SecurityHeaders', ['Configuration'], function(Configuration) {
    // Issue 344405 Penetration Test Finding - Missing Security Headers
    // First we release this new config but we ignore it till next release
    // To stop ignoring it, change enableDisallow to true
    const enableDisallow = true;

    const DISALLOW_FRAMING = 'DISALLOW FRAMING';
    const ALLOW_FRAMING_CUSTOM = 'ALLOW FRAMING CUSTOM';

    const XFOHeader = 'X-Frame-Options';
    const CSPHeader = 'Content-Security-Policy';
    const XFOHeaderSameOrigin = 'SAMEORIGIN';
    let CSPHeaderFrameAncestors = 'frame-ancestors ';
    const CSPHeaderSelf = "'self'";

    const SecurityHeaders = {
        addSecurityHeaders: function(response) {
            const allowFraming = Configuration.get('security.allowFraming');

            if (allowFraming === DISALLOW_FRAMING && enableDisallow) {
                response.addHeader(XFOHeader, XFOHeaderSameOrigin);
                response.addHeader(CSPHeader, CSPHeaderFrameAncestors + CSPHeaderSelf);
            } else if (allowFraming === ALLOW_FRAMING_CUSTOM) {
                const allowFramingBy = Configuration.get('security.allowFramingBy');

                if (allowFramingBy.length === 1) {
                    let origin = allowFramingBy[0];
                    if (origin !== XFOHeaderSameOrigin) {
                        origin = (/^https?:\/\//.test(origin) ? '' : 'https://') + origin;
                        // ALLOW-FROM has limited browser support and will disable Clickjacking
                        // protection on modern browsers, please consider using CSP frame-ancestor
                        // directive instead: https://caniuse.com/#x-frame-options
                        origin = `ALLOW-FROM ${origin}`;
                    }
                    response.addHeader(XFOHeader, origin);
                }

                CSPHeaderFrameAncestors += allowFramingBy
                    .join(' ')
                    .replace(XFOHeaderSameOrigin, CSPHeaderSelf);
                response.addHeader(CSPHeader, CSPHeaderFrameAncestors);
            }

            const headers = Configuration.get('security.headers', []);

            headers.forEach(header => {
                try {
                    response.addHeader(header.name, header.value);
                } catch (e) {
                    console.error(
                        `SecurityHeaders Error`,
                        `Header: ${header.name}:${header.value}.\nError: ${JSON.stringify(e)}`
                    );
                }
            });
        }
    };

    return SecurityHeaders;
});
