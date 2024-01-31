// @module GoogleAnalytics4
(function (win, name) {
    // @class GoogleAnalytics4 @extends ApplicationModule
    // ------------------
    // Loads google analytics 4 script and extends application with methods:
    // * trackPageview
    // * trackEvent
    // * trackTransaction
    // Also wraps layout's showInModal
    define('GoogleAnalytics4', [
        'Tracker',
        'underscore',
        'jQuery',
        'Backbone',
        'Utils',
        'SC.Configuration'
    ], function (Tracker, _, jQuery, Backbone, Utils, Configuration) {
        var dataLayerName = name + 'DataLayer';
        var GoogleAnalytics4 = {
            // @method doCallback Indicates if this module do a callback after some particular events
            // @return {Boolean}
            doCallback: function () {
                return !!win[name];
            },

            // @method trackPageview
            // @param {String} url
            // @return {GoogleAnalytics4}
            trackPageview: function (url) {
                if (_.isString(url)) {
                    url = url.split('?')[0];
                    win.gtag('event', 'page_view', { page_location: url, page_title: url });
                }

                return this;
            },

            trackLogin: function (event) {
                win.gtag('event', 'login', {
                    method: event.category,
                    event_callback: event.callback
                });

                return this;
            },

            trackRegister: function (event) {
                win.gtag('event', 'sign_up', {
                    method: event.category,
                    event_callback: event.callback
                });

                return this;
            },
            trackCheckoutAsGuest: function (event) {
                win.gtag('event', 'checkout_as_guest', {
                    method: event.category,
                    event_callback: event.callback
                });

                return this;
            },

            // @method trackEvent
            // @param {TrackEvent} event
            // @return {GoogleAnalytics}
            trackEvent: function (event) {
                if (event && event.category && event.action) {
                    win.gtag('event', 'generic_event', {
                        category: event.category,
                        action: event.action,
                        label: event.label,
                        value: parseFloat(event.value) || 0,
                        page: event.page || "/" + Backbone.history.fragment,
                        event_callback: event.callback
                    });
                }

                return this;
            },

            // @method trackTransaction
            // Based on the created SalesOrder we trigger each of the analytics
            // ecommerce methods passing the required information
            // @param {Tracker.Transaction.Model} @extends Backbone.Model transaction
            // @return {GoogleAnalytics|Void}
            trackTransaction: function (transaction) {
                var transaction_id = transaction.get('confirmationNumber');

                var purchase = {
                    transaction_id: transaction_id,
                    value: transaction.get('subTotal'),
                    tax: transaction.get('taxTotal'),
                    shipping: transaction.get('shippingCost') + transaction.get('handlingCost'),
                    currency:
                        (SC.ENVIRONMENT.currentCurrency && SC.ENVIRONMENT.currentCurrency.code) ||
                        '',
                    affiliation: Configuration.get('siteSettings.displayname'),
                    items: []
                };

                transaction.get('products').each(function (product, index) {
                    purchase.items.push({
                        item_id: product.get('id'),
                        item_name: product.get('name'),
                        affiliation: Configuration.get('siteSettings.displayname'),
                        currency:
                            (SC.ENVIRONMENT.currentCurrency &&
                                SC.ENVIRONMENT.currentCurrency.code) ||
                            '',
                        index: index,
                        item_category: product.get('category') || '',
                        item_variant: product.get('options'),
                        price: product.get('rate'),
                        quantity: product.get('quantity')
                    });
                });

                win.gtag('event', 'purchase', purchase);

                return this;
            },

            // @method addCrossDomainParameters
            // @param {string} url
            // @return {String} url
            addCrossDomainParameters: function (url) {
                // We only need to add the parameters if the URL we are trying to go
                // is not a sub domain of the tracking domain
                if (_.isString(url)) {
                    url = Utils.addParamsToUrl(url, {
                        client_id: win[name].client_id,
                        session_id: win[name].session_id
                    });
                }

                return url;
            },

            // @method loadScript
            // @return {jQuery.Promise|Void}
            loadScript: function (id) {
                return jQuery.getScript(
                    '//www.googletagmanager.com/gtag/js?id=' + id + '&l=' + dataLayerName
                );
            },

            // @method mountToApp
            // @param {ApplicationSkeleton} application
            // @return {Void}
            mountToApp: function (application) {
                var tracking = Configuration.get('tracking.googleAnalyticsFour');

                // if track page view needs to be tracked
                if (tracking && tracking.propertyID && !SC.isPageGenerator()) {
                    win[dataLayerName] = win[dataLayerName] || [];
                    win.gtag =
                        win.gtag ||
                        function () {
                            win[dataLayerName].push(arguments);
                        };
                    var domains = [];
                    if (tracking.domainName) {
                        domains.push(tracking.domainName);
                    }
                    if (tracking.domainNameSecure) {
                        domains.push(tracking.domainNameSecure);
                    }

                    if (domains.length) {
                        win.gtag('set', 'linker', {
                            domains: domains
                        });
                    }

                    var configOptions = {
                        send_page_view: false
                    };

                    var client_id = Utils.getParameterByName(win.location.href, 'client_id');
                    var session_id = Utils.getParameterByName(win.location.href, 'session_id');

                    if (client_id && session_id) {
                        configOptions.client_id = client_id;
                        configOptions.session_id = session_id;
                    }

                    win.gtag('js', new Date());
                    win.gtag('config', tracking.propertyID, configOptions);

                    // Please keep this statement here or the first pageView on site load
                    // will not be triggered (ApplicationSkeleton.Layout._showContent)
                    Tracker.getInstance().trackers.push(GoogleAnalytics4);

                    // the analytics script is only loaded if we are on a browser
                    application.getLayout().once('afterAppendView', function () {
                        GoogleAnalytics4.loadScript(tracking.propertyID)
                            .done(function () {
                                win[name] = {};
                                win.gtag('get', tracking.propertyID, 'client_id', function (client_id) {
                                    win[name].client_id = client_id;
                                });
                                win.gtag('get', tracking.propertyID, 'session_id', function (session_id) {
                                    win[name].session_id = session_id;
                                });
                            })
                            .fail(function (jqXhr) {
                                jqXhr.preventDefault = true;
                                console.warn('Google Analytics 4 was unable to load');
                            });
                    });
                }
            }
        };

        return GoogleAnalytics4;
    });
})(window, 'ga4');