/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentInstrumentACH", ["require", "exports", "Utils", "PaymentInstrumentACH.List.View", "PaymentInstrumentACH.Edit.View", "Configuration"], function (require, exports, Utils, PaymentInstrumentACH_List_View_1, PaymentInstrumentACH_Edit_View_1, Configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mountToApp = void 0;
    function mountToApp(application) {
        if (!(Configuration_1.Configuration.get('paymentInstrumentACHEnabled') ||
            Configuration_1.Configuration.get('checkoutApp.isAchEnabledInCheckout'))) {
            return;
        }
        var pageType = application.getComponent('PageType');
        pageType.registerPageType({
            name: 'ACHList',
            routes: ['ach'],
            view: PaymentInstrumentACH_List_View_1.PaymentInstrumentACHListView,
            defaultTemplate: {
                name: 'paymentinstrument_ach_list.tpl',
                displayName: 'ACH Payments',
                thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-paymentinstrument-ach-list.png')
            }
        });
        pageType.registerPageType({
            name: 'ACHDetails',
            routes: ['ach/:id'],
            view: PaymentInstrumentACH_Edit_View_1.PaymentInstrumentACHEditView,
            defaultTemplate: {
                name: 'paymentinstrument_ach_edit.tpl',
                displayName: 'ACH Payment Edit',
                thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-paymentinstrument-ach-detail.png')
            }
        });
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=PaymentInstrumentACH.js.map
