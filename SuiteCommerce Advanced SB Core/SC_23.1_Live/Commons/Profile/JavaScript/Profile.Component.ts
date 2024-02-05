/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Profile.Component"/>
import * as Utils from '../../Utilities/JavaScript/Utils';
import * as jQuery from '../../Core/JavaScript/jQuery';
import { ProfileModel } from './Profile.Model';
import { SCBaseComponent } from '../../SC/JavaScript/SC.BaseComponent';

const parseValue = function(value) {
    switch (value) {
        case 'T':
            return true;
        case 'F':
            return false;
        default:
            return value;
    }
};

var filter = function(original, whitelist) {
    let normalized: any = {};
    for (let i = 0; i < whitelist.length; i++) {
        const item = whitelist[i];
        if (original instanceof Array) {
            normalized = [];
            for (let j = 0; j < original.length; j++) {
                const obj = original[j];
                normalized.push(filter(obj, whitelist));
            }
        } else if (original[item.att]) {
            if (item.rename) {
                normalized[item.rename] = item.inner
                    ? filter(original[item.att], whitelist[i].inner)
                    : parseValue(original[item.att]);
            } else {
                normalized[item.att.replace(new RegExp('_', 'g'), '').toLowerCase()] = item.inner
                    ? filter(original[item.att], whitelist[i].inner)
                    : parseValue(original[item.att]);
            }
        }
    }
    return normalized;
};

const normalize = function(original) {
    const whitelist = [
        { att: 'addressbook' },
        {
            att: 'addresses',
            inner: [
                { att: 'addr1' },
                { att: 'addr2' },
                { att: 'addr3' },
                { att: 'city' },
                { att: 'company' },
                { att: 'country' },
                { att: 'defaultbilling' },
                { att: 'defaultshipping' },
                { att: 'fullname' },
                { att: 'internalid' },
                { att: 'isresidential' },
                { att: 'isvalid' },
                { att: 'phone' },
                { att: 'state' },
                { att: 'zip' }
            ]
        },
        { att: 'balance' },
        {
            att: 'campaignsubscriptions',
            inner: [{ att: 'internalid' }, { att: 'name' }, { att: 'description' }]
        },
        { att: 'companyname' },
        { att: 'creditholdoverride' },
        { att: 'creditlimit' },
        { att: 'customfields', inner: [{ att: 'name', rename: 'id' }, { att: 'value' }] },
        { att: 'email' },
        { att: 'emailsubscribe' },
        { att: 'firstname' },
        { att: 'internalid' },
        { att: 'isGuest' },
        { att: 'isLoggedIn' },
        { att: 'isRecognized' },
        { att: 'language' },
        { att: 'lastname' },
        { att: 'middlename' },
        { att: 'name' },
        {
            att: 'paymentterms',
            inner: [{ att: 'internalid' }, { att: 'name' }]
        },
        {
            att: 'phoneinfo',
            inner: [{ att: 'altphone' }, { att: 'fax' }, { att: 'phone' }]
        },
        { att: 'priceLevel' },
        { att: 'subsidiary' },
        { att: 'type' }
    ];

    if (original.campaignsubscriptions) {
        const subscribedTo = [];
        for (let i = 0; i < original.campaignsubscriptions.length; i++) {
            const campaign = original.campaignsubscriptions[i];
            if (campaign.subscribed) {
                subscribedTo.push(campaign);
            }
        }
        original.campaignsubscriptions = subscribedTo;
    }

    return filter(original, whitelist);
};

interface CreditCard {
    expirationDate: string;
    number: string;
    name: string;
    images: string[];
    paymentMethodId: string;
    paymentMethodName: string;
    paymentMethodKey: string;
}

interface CustomerSegment {
    id: number;
    name: string;
}

interface CookieOptions {
    [index: string]: string;
    consentLastUpdate?: string;
}

const normalizeCreditCard = function(card): CreditCard {
    return {
        // if payment instruments is enabled ccexpiredate is not available
        expirationDate: card.get('ccexpiredate') || card.get('cardexpirationdate'),
        // if payment instruments is enabled ccnumber is not available
        number: card.get('ccnumber') || card.get('cardlastfourdigits'),
        name: card.get('ccname'),
        images: card.get('paymentmethod').imagesrc,
        paymentMethodId: card.get('paymentmethod').internalid,
        paymentMethodName: card.get('paymentmethod').name,
        paymentMethodKey: card.get('paymentmethod').key
    };
};

const normalizeCustomerSegment = function({id, name}): CustomerSegment {
    return {
        id,
        name,
    };
};

const isCookieOptionsValid = function(cookieOptions: CookieOptions): boolean {
    let isValid = true;
    Object.keys(cookieOptions).forEach((key) => {
        if (typeof cookieOptions[key] !== 'boolean') {
            isValid = false;
        };
    });
    return isValid;
}

const ProfileComponent: any = {
    mountToApp: function(container) {
        container.registerComponent(this.componentGenerator(container));
    },

    componentGenerator: function(container) {
        return SCBaseComponent.extend({
            componentName: 'UserProfile',

            application: container,

            DEFAULT_SEGMENTS: {
                ALL_USERS: -1,
                ANONYMOUS_USERS: -2,
                RECOGNIZED_AND_LOGGED_IN_USERS: -3,
            },

            getUserProfile: function() {
                const promise = jQuery.Deferred();
                ProfileModel.getPromise().then(function() {
                    promise.resolve(normalize(Utils.deepCopy(ProfileModel.getInstance())));
                });
                return promise;
            },

            getCreditCards: function(): JQuery.Deferred<CreditCard[]> {
                try {
                    if (!Utils.isCheckoutDomain()) {
                        this._reportError(
                            'UNSECURE_SESSION',
                            'Unsecure session: Must be under a secure domain or logged in'
                        );
                    }
                    const paymentMethods = ProfileModel.getInstance().get('paymentmethods');
                    const creditCards: CreditCard[] = paymentMethods
                        .filter(
                            paymentMethod => paymentMethod.get('paymentmethod').creditcard === 'T'
                        )
                        .map(card => normalizeCreditCard(card));
                    return jQuery.Deferred().resolve(Utils.deepCopy(creditCards));
                } catch (error) {
                    return jQuery.Deferred().reject(error);
                }
            },

            getCustomerSegments: function(): JQuery.Deferred<CustomerSegment[]> {
                try {
                    let customerSegments = ProfileModel.getInstance().get('segments');
                    customerSegments = customerSegments.map(customerSegment => normalizeCustomerSegment(customerSegment));
                    return jQuery.Deferred().resolve(Utils.deepCopy(customerSegments));
                } catch (error) {
                    return jQuery.Deferred().reject(error);
                }
            },

            getCookieOptions: function(): JQuery.Deferred<CookieOptions[]> {
                try {
                    const profileModelInstance = ProfileModel.getInstance();
                    let cookieOptions = profileModelInstance.get('cookieoptions');
                    if (cookieOptions) {
                        cookieOptions.consentLastUpdate = profileModelInstance.get('consentlastupdate');
                    }
                    return jQuery.Deferred().resolve(Utils.deepCopy(cookieOptions));
                } catch (error) {
                    return jQuery.Deferred().reject(error);
                }
            },

            setCookieOptions: function (cookieOptions): JQuery.Deferred<string> {
                const deferred = jQuery.Deferred();
                try {
                    let profileModel = ProfileModel.getInstance();
                    if (!Utils.isCheckoutDomain() || profileModel.get('isLoggedIn') === 'F') {
                        this._reportError(
                            'UNSECURE_SESSION',
                            'Unsecure session: Must be under a secure domain and logged in'
                        );
                    }
                    if (!isCookieOptionsValid(cookieOptions)) {
                        this._reportError(
                            'INVALID_PARAM',
                            'Invalid parameter: CookieOptions must be an object conformed by name:boolean'
                        );
                    }
                    profileModel.set({consentlastupdate: Date.now()});
                    profileModel.set({cookieoptions: cookieOptions});
                    profileModel.save().done((cb) => {
                        deferred.resolve();
                    });
                } catch (error) {
                    deferred.reject(error);
                }
                return deferred;
            }
        });
    }
};

export = ProfileComponent;
