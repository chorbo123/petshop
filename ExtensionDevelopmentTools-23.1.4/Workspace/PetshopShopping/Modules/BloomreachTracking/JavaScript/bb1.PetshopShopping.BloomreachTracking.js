//@module BloomreachTracking
(
    function (win, name)
    {
        'use strict';

        //@class bb1.PetshopShopping.BloomreachTracking @extends ApplicationModule
        // ------------------
        define('bb1.PetshopShopping.BloomreachTracking',
            [
                'Tracker',
                'Profile.Model',
                'underscore',
                'jQuery',
                'Backbone',
                'Utils',
                'SC.Configuration',
            ], function (Tracker, ProfileModel, _, jQuery, Backbone, Utils, Configuration)
            {
                var BloomreachTracking = {

                    isIdentified: false,
                    bloomreachProductList: [],
                    currentProduct: null,
                    currentCheckoutStep: 0,

                    defaultTimeout: 4e3,

                    defaultHideClass: 'xnpe_async_hide',

                    //@method doCallback Indicates if this module do a callback after some particular events
                    //@return {Boolean}
                    doCallback: function ()
                    {
                        //return true; //return !!win[name];
                    },

                    //@method trackPageview
                    //@param {String} url
                    //@return {BloomreachTracking}
                    trackPageview: function (url)
                    {
                        console.log('trackPageview');
                        if (_.isString(url))
                        {
                            //win[name]('send', 'pageview', url);
                            //win[name].start();
                        }

                        return this;
                    },

                    trackLogin: function (event)
                    {
                        console.log('trackLogin', event, this);

                        var profile_model = ProfileModel.getInstance();
                        profile_model.set(this.application.getLayout()._currentView.childViewInstances.Login.Login.childViewInstance.model.attributes.user);
                        var customerId = parseInt((
                            profile_model.get('name') || '').replace(/ .*/, ''), 10);

                        if (customerId > 0)
                        {
                            if (!this.isIdentified)
                            {
                                win[name].identify({
                                    netsuite_id: customerId,
                                    email_id: profile_model.get('email').toLowerCase().trim(),
                                });
                                this.isIdentified = true;
                            }

                            win[name].track('login', {
                                'netsuite_id': customerId,
                                'email_id': profile_model.get('email').toLowerCase().trim(),
                            });
                        }

                        return this;
                        //return this.trackEvent(event);
                    },

                    trackRegister: function (event)
                    {
                        console.log('trackRegister', event, this);

                        var profile_model = ProfileModel.getInstance();
                        profile_model.set(this.application.getLayout()._currentView.childViewInstances.Register.Register.childViewInstance.model.attributes.user);
                        var customerId = parseInt((
                            profile_model.get('name') || '').replace(/ .*/, ''), 10);

                        if (customerId > 0)
                        {
                            if (!this.isIdentified)
                            {
                                win[name].identify({
                                    netsuite_id: customerId,
                                    email_id: profile_model.get('email').toLowerCase().trim(),
                                });
                                this.isIdentified = true;
                            }

                            win[name].track('registration', {
                                'netsuite_id': customerId,
                                'email_id': profile_model.get('email').toLowerCase().trim(),
                            });
                        }

                        return this;
//				return this.trackEvent(event);
                    },

                    trackCheckoutAsGuest2: function (event)
                    {
                        console.log('trackCheckoutAsGuest2', event, this);
                        return this.trackEvent(event);
                    },

                    //@method trackEvent
                    //@param {TrackEvent} event
                    //@return {BloomreachTracking}
                    trackEvent2: function (event)
                    {
                        console.log('trackEvent2', event, this);
                        if (event && event.category && event.action)
                        {
                            // [Event Tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/events#implementation)
                            win[name]('send', 'event', event.category, event.action, event.label, parseFloat(event.value) || 0, {
                                'hitCallback': event.callback,
                                'page': event.page || '/' + Backbone.history.fragment,
                            });
                        }

                        return this;
                    },

                    trackProductView: function (product)
                    {
                        /*if (this.item && this.item.get('itemId') === item.get('_id'))
                        {
                         item.set('category', this.item.get('category'));
                         item.set('list', this.item.get('list'));
                        }*/

                        /*var eventName = 'productView'
                        ,	price = item.getPrice()
                        ,	eventData = {
                         'event': eventName
                        ,	'data': {
                          'sku': item.get('_sku', true)
                         ,	'name': item.get('_name')
                         ,	'variant': _.map(item.itemOptions, function(option) { return option.label; }).sort().join(', ')
                         ,	'price': ((price.price) ? price.price : 0).toFixed(2)
                         ,	'category': item.get('category') || ''
                         ,	'list': item.get('list') || ''

                         ,	'page': this.getCategory()
                         }
                        };*/

                        //this.item = null;

                        var item = product.get('item');
                        var price = item.getPrice();

                        console.log('trackProductView item');
                        console.log(item);
                        console.log(product);

                        if (this.currentProduct != item.id)
                        {
                            win[name].track('view_item', {
                                'category': this.getCategory(),
                                'name': item.get('_name'),
                                'price': (
                                    (
                                        price.price) ? price.price : 0).toFixed(2),
                                'product_id': item.id,
                            });
                        }

                        this.currentProduct = item.id;

                        return this;
                    },

                    trackAddToCart: function (line)
                    {
                        // Steve Boot 21/06/2022 - This is now implemented via cart change:lines event within mountToApp

                        return this;
                    },

                    // @method getCategory
                    // @return {String}
                    getCategory: function ()
                    {
                        var options = _.parseUrlOptions(Backbone.history.fragment),
                            page = options.page || '';

                        return '/' + Backbone.history.fragment.split('?')[0] + (
                            page ? '?page=' + page : '');
                    },

                    //@method trackTransaction
                    // Based on the created SalesOrder we trigger each of the analytics
                    // ecommerce methods passing the required information
                    // [Ecommerce Tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce)
                    //@param {Tracker.Transaction.Model} @extends Backbone.Model transaction
                    //@return {BloomreachTracking|Void}
                    trackTransaction2: function (transaction)
                    {
                        var transaction_id = transaction.get('confirmationNumber');

                        console.log('transaction');
                        console.log(transaction);
                        var productList = [];

                        transaction.get('products').each(function (product)
                        {
                            productList.push({
                                purchase_id: transaction_id,
                                //,	affiliation: Configuration.get('siteSettings.displayname')
                                item: product.get('id'),
                                product_id: product.get('id'),
                                //,	name: product.get('name')
                                //,	category: product.get('category') || ''
                                price: product.get('rate'),
                                amount: product.get('quantity') * product.get('rate'),
                                quantity: product.get('quantity'),
                            });
                        });

                        console.log('trackTransaction2');
                        win[name].track('purchase', {
                            purchase_id: transaction_id,
                            purchase_status: 'success',
                            items: productList,
                            product_list: productList,
                            tax: transaction.get('taxTotal').toString(),
                            amount: transaction.get('total'),
                            total_price: transaction.get('total'),
                            //payment_type: 'credit_card'
                        });

                        console.log('total');
                        console.log(transaction.get('total'));
                        transaction.get('products').each(function (product)
                        {
                            console.log('product');
                            console.log(product);
                            win[name].track('purchase_item', {
                                purchase_id: transaction_id,
                                purchase_status: 'success',
                                product_id: product.get('id'),
                                price: product.get('rate'),
                                //total_price: product.get('total'),
                                title: product.get('name'),
                                quantity: product.get('quantity'),
                                category_1: product.get('category') || '',
                            });
                        });

                        return this;
                    },

                    trackProductList: function (items, listName)
                    {
                        console.log('trackProductList items, listName', items, listName);
                        var category = null;

                        if (listName == 'Category')
                        {
                            category = this.application.getLayout().getCurrentView().model.get('category');

                            if (category)
                            {
                                win[name].track('view_category', {
                                    category_id: category.get('internalid'),
                                    category_name: category.get('name'),
                                    category_path: category.get('fullurl'),
                                    category_title: category.get('pageheading'),
                                    products_list: items.map(function (item)
                                    {
                                        return {
                                            name: item.get('_name'),
                                            image_url: item.get('_thumbnail').url,
                                            price: item.get('_priceDetails').onlinecustomerprice,
                                            sku: item.get('_sku'),
                                            id: item.id,
                                        };
                                    }),
                                    products_ids: items.pluck('internalid'),
                                });

                                // Remember last viewed Category Breadcrumb for tracking purposes
                                var cookie_warning_settings = Configuration.get('cookieWarningBanner');
                                var show_cookie_warning_banner = Configuration.get('siteSettings.showcookieconsentbanner') === 'T';

                                // Honour EU Cookie warning config
                                if (!show_cookie_warning_banner || (
                                    show_cookie_warning_banner && cookie_warning_settings.saveInCookie && jQuery.cookie('isCookieWarningClosed')))
                                {
                                    jQuery.cookie('lastFacetBreadcrumb', category.get('breadcrumb'));
                                }
                            }
                        }
                    },

                    trackPageviewForCheckoutStep: function (step)
                    {
                        this.currentCheckoutStep = step;

                        console.log('trackPageviewForCheckoutStep step', step);

                        this._trackCheckoutStep(this.currentCheckoutStep);
                    },

                    /**
                     * @method trackTransaction
                     * @description Tracks checkout confirmation page.
                     * @param {Object} transaction
                     */
                    trackTransaction: function (transaction)
                    {
                        this.currentCheckoutStep++;

                        console.log('trackTransaction transaction', transaction);

                        this._trackCheckoutStep(this.currentCheckoutStep, transaction.get('confirmationNumber'));
                    },

                    /**
                     * @method _trackCheckoutStep
                     * @description Tracks checkout steps. Deems confirmation page as final step of checkout.
                     * @param {(string|number)} step
                     * @param {string} [confirmationNumber]
                     * @private
                     */
                    _trackCheckoutStep: function (step, confirmationNumber)
                    {
                        var self = this;

                        this.application.getCart().done(function (cart)
                        {
                            var trackingData = {};
                            var profile_model = ProfileModel.getInstance();
                            var shipAddressId = cart.get('shipaddress');
                            var shipAddress = cart.get('addresses').findWhere({internalid: shipAddressId});
                            var billAddressId = cart.get('billaddress');
                            var billAddress = cart.get('addresses').findWhere({internalid: billAddressId});
                            var shipMethodId = cart.get('shipmethod');
                            var shipMethod = cart.get('shipmethods').findWhere({internalid: shipMethodId});
                            var lines = cart.get('lines');
                            var total_quantity = 0;

                            lines.each(function (line)
                            {
                                total_quantity += line.get('quantity');
                            });

                            trackingData = {
                                order_id: confirmationNumber,
                                step_number: step, // 1, 2, 3, 4, 5, 6, 7, 8, 9
                                step_title: self.application.getLayout().getCurrentView().currentStep ? self.application.getLayout().getCurrentView().currentStep.stepGroup.name : 'Login/Register', // Free gift, Add-ons, Flea & Wormers, Do You Need?, Flash Sale, Shipping Address, Delivery Method, Payment, Review

                                // Cart
                                total_price: cart.get('summary').total,
                                total_quantity: total_quantity,
                                products_list: lines.map(function (line)
                                {
                                    var item = line.get('item');
                                    return {
                                        product_id: item.id,
                                        product_qty: line.get('quantity'),
                                        product_sku: item.get('_sku'),
                                    };
                                }),
                                products_details: lines.map(function (line)
                                {
                                    var item = line.get('item');
                                    return {
                                        name: item.get('_name'),
                                        image_url: item.get('_thumbnail').url,
                                        price: item.get('_priceDetails').onlinecustomerprice,
                                        sku: item.get('_sku'),
                                        id: item.id,
                                        qty: line.get('quantity'),
                                    };
                                }),

                                // Shipping
                                shipping_city: shipAddress && shipAddress.get('city'),
                                shipping_country: shipAddress && shipAddress.get('country'),
                                shipping_cost: cart.get('summary').shippingcost + cart.get('summary').handlingcost,
                                shipping_type: shipMethod && shipMethod.get('name'),

                                // Billing
                                city: billAddress && billAddress.get('city'),
                                country: billAddress && billAddress.get('country'),
                                postcode: billAddress && billAddress.get('zip'),
                                payment_type: (
                                    cart.get('paymentmethods') &&
                                    cart.get('paymentmethods').length &&
                                    cart.get('paymentmethods').first() &&
                                    cart.get('paymentmethods').first().get('type')) || null,
                                payment_method: (
                                    cart.get('paymentmethods') &&
                                    cart.get('paymentmethods').length &&
                                    cart.get('paymentmethods').first() &&
                                    cart.get('paymentmethods').first().get(cart.get('paymentmethods').first().get('type')) &&
                                    cart.get('paymentmethods').first().get(cart.get('paymentmethods').first().get('type')).paymentmethod &&
                                    cart.get('paymentmethods').first().get(cart.get('paymentmethods').first().get('type')).paymentmethod.name) || null,

                                // User
                                buyer_name: profile_model.get('firstname'),
                                buyer_surname: profile_model.get('lastname'),
                                buyer_email: profile_model.get('email'),
                                buyer_phone: profile_model.get('phone'),
                                newsletter: false,
                                currency: (
                                    profile_model.get('currency') && profile_model.get('currency').code) || SC.ENVIRONMENT.currentCurrency.code,
                                language: SC.ENVIRONMENT.currentLanguage.locale,
                            };

                            // Final step of checkout
                            if (confirmationNumber)
                            {
                                trackingData.step_title = 'Order Summary';

                                delete trackingData.total_price;
                                delete trackingData.total_quantity;
                                delete trackingData.products_list;
                                delete trackingData.products_details;
                                delete trackingData.payment_type;
                                delete trackingData.payment_method;
                            }

                            win[name].track('checkout', trackingData);
                        });
                    },

                    //@method setAccount
                    //@param {SC.Configuration} config
                    //@return {Void}
                    setAccount: function (config)
                    {
                        if (!config)
                        {
                            return this;
                        }

                        var profile_model = ProfileModel.getInstance();
                        var customerId = (
                            profile_model.get('name') || '').replace(/ .*/, '');
                        //var domainName = Utils.isCheckoutDomain() ? config.domainNameSecure : config.domainName;

                        if (_.isString(config.apiToken))
                        {
                            this.apiConfig = {};
                            this.apiConfig.target = config.apiUrl || 'https://api.uk.exponea.com';
                            this.apiConfig.token = config.apiToken || '';
                            //this.apiConfig.customer = customerId ? {netsuite_id: customerId, email_id: profile_model.get('email').toLowerCase().trim()} : '';
                            this.apiConfig.track = {
                                visits: true,
                                google_analytics: true,
                            };
                            this.apiConfig.file_path = config.apiFullPath || config.apiUrl + '/js/exponea.min.js';

                            win[name] = this.objectify(['anonymize', 'initialize', 'identify', 'update', 'track', 'trackLink', 'trackEnhancedEcommerce', 'getHtml', 'showHtml', 'showBanner', 'showWebLayer', 'ping', 'getAbTest', 'loadDependency', 'getRecommendation', 'reloadWebLayers']);
                            win[name].notifications = this.objectify(['isAvailable', 'isSubscribed', 'subscribe', 'unsubscribe']);
                            win[name]['snippetVersion'] = 'v2.3.0';

                            win[name]['_performance'] = {nowFn: Date.now};
                            win[name]['_performance'].snippetStartTime = win[name]['_performance'].nowFn();

                            win['webxpClient'] = {
                                sdk: win[name],
                                sdkObjectName: name,
                                skipExperiments: !!this.apiConfig.new_experiments,
                                sign: this.apiConfig.apiToken + '/' + (
                                    RegExp('__exponea_etc__' + '=([\\w-]+)').exec(document.cookie) || ['', 'new'])[1],
                                path: this.apiConfig.apiUrl,
                            };

                            //target: "https://api.uk.exponea.com",
                            //token: "5a2dcc1e-ab5d-11ec-9b96-3e1a4691bd73",
                            // replace with current customer ID or leave commented out for an anonymous customer
                            // customer: window.currentUserId,
                            //track: {
                            //    google_analytics: false,
                            //},

                            /*win[name]('create', this.propertyID, {
                                'cookieDomain': this.domainName
                            ,	'allowLinker': true
                            });*/
                        }

                        return this;
                    },

                    //@method addCrossDomainParameters
                    // [Decorating HTML Links](https://developers.google.com/analytics/devguides/collection/analyticsjs/cross-domain#decoratelinks)
                    //@param {string} url
                    //@return {String} url
                    addCrossDomainParameters: function (url)
                    {
                        return url;
                    },

                    //@method loadScript
                    //@return {jQuery.Promise|Void}
                    loadScript: function ()
                    {
                        console.log('BloomreachTracking.loadScript');
                        //var i = t.createElement(n);
                        //i.src = e;
                        //var o = t.getElementsByTagName(n)[0];
                        //return o.parentNode.insertBefore(i, o), i
                        //loadScript2(this.apiConfig.file_path, "script", document);
                        var self = this;
                        var scriptTag = !SC.isPageGenerator() &&
                            jQuery.getScript(this.apiConfig.file_path);

                        console.log(scriptTag);
                        console.log(this.apiConfig.file_path);
                        //if (scriptTag) {

                        /*if (this.apiConfig.new_experiments)
                        {
                            !0 === this.apiConfig.new_experiments && (this.apiConfig.new_experiments = {});
                            var f, l = this.apiConfig.new_experiments.hide_class || this.defaultHideClass,
                                _ = this.apiConfig.new_experiments.timeout || this.defaultTimeout,
                                d = encodeURIComponent(win.location.href.split("#")[0]);
                            this.apiConfig.cookies && this.apiConfig.cookies.expires && ("number" == typeof this.apiConfig.cookies.expires || this.isDate(this.apiConfig.cookies.expires) ? f = this.getDate(this.apiConfig.cookies.expires) : this.apiConfig.cookies.expires.tracking && ("number" == typeof this.apiConfig.cookies.expires.tracking || this.isDate(this.apiConfig.cookies.expires.tracking)) && (f = this.getDate(this.apiConfig.cookies.expires.tracking))), f && f < new Date && (f = void 0);

                            var x = this.apiConfig.target + "/webxp/" + "script" + "/" + win["webxpClient"].sign + "/modifications.min.js?http-referer=" + d + "&timeout=" + _ + "ms" + (f ? "&cookie-expires=" + Math.floor(f.getTime() / 1e3) : "");

                            "sync" === this.apiConfig.new_experiments.mode && win.localStorage.getItem("__exponea__sync_modifications__") ? function (e, "script", t, i, o)
                            {
                                t[o]["script"] = "<" + "script" + ' src="' + e + '"></' + "script" + ">", i.writeln(t[o]["script"]), i.writeln("<" + "script" + ">!" + o + ".init && document.writeln(" + o + "." + "script" + '.replace("/' + "script" + '/", "/' + "script" + '-async/").replace("><", " async><"))</' + "script" + ">")
                            }(x, "script", win, document, "webxpClient") : function (e, "script", t, i, o, r, c, a)
                            {
                                r.documentElement.classList.add(e);
                                var s = m(t, i, r);

                                function p()
                                {
                                    o[a].init || m(t.replace("/" + i + "/", "/" + i + "-async/"), i, r)
                                }

                                function u()
                                {
                                    r.documentElement.classList.remove(e)
                                }
                                s.onload = p, s.onerror = p, o.setTimeout(u, "script"), o[c]._revealPage = u
                            }(l, _, x, "script", win, document, o, "webxpClient")
                        }
                    }(this.apiConfig, "script", "webxpClient", 0, name, win, document);*/

                        win[name].start = function (params)
                        {
                            params && Object.keys(params).forEach((
                                function (key)
                                {
                                    return self.apiConfig[key] = params[key];
                                })), win[name].initialize(self.apiConfig);
                        };

                        win[name].start();

                        this.application.getUser().done(function (user)
                        {
                            var customerId = parseInt((
                                user.get('name') || '').replace(/ .*/, ''), 10);
                            console.log('customerId', customerId);
                            if (customerId > 0)
                            {
                                win[name].identify({
                                    netsuite_id: customerId,
                                    email_id: user.get('email').toLowerCase().trim(),
                                });
                                self.isIdentified = true;
                            }
                        });

                        return scriptTag;
                    },

                    getDate: function (e)
                    {
                        if ('number' != typeof e)
                        {
                            return e;
                        }

                        var n = new Date;

                        return new Date(n.getTime() + 1e3 * e);
                    },

                    objectify: function (e)
                    {
                        return e.reduce((
                                function (e, n)
                                {
                                    return e[n] = function ()
                                    {
                                        e._.push([n.toString(), arguments]);
                                    }, e;
                                }),
                            {
                                _: [],
                            });
                    },

                    isDate: function (e)
                    {
                        return '[object Date]' === Object.prototype.toString.call(e);
                    },

                    //@method mountToApp
                    //@param {ApplicationSkeleton} application
                    //@return {Void}
                    mountToApp: function (application)
                    {
                        var self = this;
                        var trackingConfig = application.getConfig('tracking.bloomreachTracking');

                        console.log('BloomreachTracking.mountToApp');
                        console.log(trackingConfig);
                        if (trackingConfig && trackingConfig.apiToken)
                        {
                            console.log('BloomreachTracking.mountToApp inside');
                            BloomreachTracking.application = application;
                            BloomreachTracking.setAccount(trackingConfig);

                            Tracker.getInstance().trackers.push(BloomreachTracking);

                            application.getLayout().once('afterAppendView', jQuery.proxy(BloomreachTracking, 'loadScript'));

                            // Implement cart change tracking
                            application.getCart().done(function (cart)
                            {
                                var lines = cart.get('lines');

                                // Initialise bloomreachProductList (to track the contents)
                                lines.each(function (line)
                                {
                                    var item = line.get('item');
                                    self.bloomreachProductList.push({
                                        item_id: item.id,
                                        item_quantity: line.get('quantity'),
                                        item_sku: item.get('_sku'),
                                        location: item.get('_url'),
                                    });
                                });

                                // Create cart change:lines callback
                                cart.on('change:lines', function ()
                                {
                                    // Don't track changes to the cart that occur after confirmation
                                    if (cart && cart.get('confirmation') && (cart.get('confirmation').confirmationnumber || cart.get('confirmation').tranid))
                                    {
                                        return;
                                    }

                                    var lines = cart.get('lines');
                                    var lastBreadcrumb = jQuery.cookie('lastFacetBreadcrumb') || [];
                                    var brCategories = {};
                                    var breadcrumbNames = [];

                                    // Get categories if available
                                    if (lastBreadcrumb.length)
                                    {
                                        breadcrumbNames = _.pluck(jQuery.cookie('lastFacetBreadcrumb'), 'name');
                                        brCategories = {};

                                        breadcrumbNames.forEach(function (category, index)
                                        {
                                            brCategories['category_' + (
                                                Object.keys(brCategories).length + 1)] = category;
                                        });
                                    }

                                    // Detect addition of lines
                                    lines.each(function (line)
                                    {
                                        var item = line.get('item');
                                        var lineFound = false;

                                        self.bloomreachProductList.forEach(function (bplLine)
                                        {
                                            if (bplLine.item_sku == item.get('_sku'))
                                            {
                                                lineFound = true;
                                            }
                                        });

                                        // If line not found in bloomreachProductList, it has been added
                                        if (!lineFound)
                                        {
                                            self.bloomreachProductList.push(_.extend({
                                                action: 'add',
                                                item_id: item.id,
                                                item_quantity: line.get('quantity'),
                                                item_sku: item.get('_sku'),
                                                location: item.get('_url'),
                                            }, brCategories));
                                            self.trackCartChange(self.bloomreachProductList[self.bloomreachProductList.length - 1]);
                                        }
                                    });

                                    // Detect change in quantities or removal of line
                                    self.bloomreachProductList.forEach(function (bplLine)
                                    {
                                        var lineFound = false;

                                        lines.each(function (line)
                                        {
                                            var item = line.get('item');

                                            if (bplLine.item_sku == item.get('_sku'))
                                            {
                                                lineFound = true;

                                                // Set action if quantity has changed
                                                if (bplLine.item_quantity != line.get('quantity') && line.get('quantity') != 0)
                                                {
                                                    bplLine.item_quantity = line.get('quantity');
                                                    bplLine.action = 'QTY +/-';
                                                    self.trackCartChange(bplLine);
                                                }
                                                else if (line.get('quantity') == 0)
                                                {
                                                    bplLine.action = 'remove';
                                                    self.trackCartChange(bplLine);
                                                }
                                            }
                                        });

                                        // If line not found in cart, it has been removed
                                        if (!lineFound)
                                        {
                                            bplLine.action = 'remove';
                                            self.trackCartChange(bplLine);
                                        }
                                    });

                                    // Changes will now have been tracked, so reinitialise bloomreachProductList
                                    self.bloomreachProductList = [];

                                    lines.each(function (line)
                                    {
                                        var item = line.get('item');
                                        self.bloomreachProductList.push({
                                            item_id: item.id,
                                            item_quantity: line.get('quantity'),
                                            item_sku: item.get('_sku'),
                                            location: item.get('_url'),
                                        });
                                    });
                                });
                            });
                        }
                    },

                    /**
                     * @method trackCartChange
                     * @param {Object} bpLine
                     */
                    trackCartChange: function (bpLine)
                    {
                        console.log('trackCartChange bpLine', bpLine);

                        var self = this;

                        this.application.getCart().done(function (cart)
                        {
                            var lines = cart.get('lines');
                            var total_quantity = 0;
                            var profile_model = ProfileModel.getInstance();
                            var trackingData = {};

                            lines.each(function (line)
                            {
                                total_quantity += line.get('quantity');
                            });

                            trackingData = {
                                action: bpLine.action,
                                product_list: _.map(_.filter(self.bloomreachProductList, function (bpLine2)
                                {
                                    return bpLine2.action != 'remove';
                                }), function (bpLine2)
                                {
                                    return {
                                        product_id: bpLine2.item_id,
                                        product_qty: bpLine2.item_quantity,
                                        product_sku: bpLine2.item_sku,
                                    };
                                }),
                                product_details: lines.map(function (line)
                                {
                                    var item = line.get('item');
                                    return {
                                        title: item.get('_name'),
                                        image_url: item.get('_thumbnail').url,
                                        price: item.get('_priceDetails').onlinecustomerprice,
                                        item_sku: item.get('_sku'),
                                        item_id: item.id,
                                        item_qty: line.get('quantity'),
                                    };
                                }),
                                total_quantity: total_quantity,
                                total_price: cart.get('summary').total,
                                currency: (
                                    profile_model.get('currency') && profile_model.get('currency').code) || SC.ENVIRONMENT.currentCurrency.code,
                                location: bpLine.location,
                            };

                            win[name].track('cart_update', trackingData);
                        });
                    },
                };

                return BloomreachTracking;
            });
    })(window, 'exponea');
