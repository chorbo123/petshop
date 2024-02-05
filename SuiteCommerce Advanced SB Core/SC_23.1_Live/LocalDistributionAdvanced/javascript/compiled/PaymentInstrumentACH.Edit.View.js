/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("PaymentInstrumentACH.Edit.View", ["require", "exports", "paymentinstrument_ach_edit.tpl", "Utils", "jQuery", "Configuration", "Profile.Model", "PaymentInstrumentACH.Model", "PaymentInstrumentACH.Collection", "PaymentInstrumentACH.Edit.Form.View", "PageTypeView", "Environment"], function (require, exports, paymentinstrument_ach_edit_tpl, Utils, jQuery, Configuration_1, Profile_Model_1, PaymentInstrumentACH_Model_1, PaymentInstrumentACH_Collection_1, PaymentInstrumentACH_Edit_Form_View_1, PageTypeView_1, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentInstrumentACHEditView = void 0;
    var PaymentInstrumentACHEditView = /** @class */ (function (_super) {
        __extends(PaymentInstrumentACHEditView, _super);
        function PaymentInstrumentACHEditView(options) {
            var _this = _super.call(this, options) || this;
            _this.ACHForm = null;
            _this.template = paymentinstrument_ach_edit_tpl;
            _this.profileModel = null;
            _this.title = '';
            _this.page_header = '';
            _this.showCardsImgs = true;
            _this.showDefaults = false;
            _this.noRedirect = false;
            _this.attributes = {
                id: 'PaymentInstrumentACHDetails',
                class: 'PaymentInstrumentACHView'
            };
            _this.getBreadcrumbPages = function () {
                return [
                    {
                        text: Utils.translate('ACH'),
                        href: '/ach'
                    },
                    {
                        text: _this.title,
                        href: '/ach/new'
                    }
                ];
            };
            _this.options = options;
            _this.application = options.application;
            _this.profileModel = Profile_Model_1.ProfileModel.getInstance();
            _this.collection =
                _this.profileModel.get('paymentmethodsach') || new PaymentInstrumentACH_Collection_1.PaymentInstrumentACHCollection();
            var id = (options.routerArguments &&
                options.routerArguments.length &&
                options.routerArguments[0]) ||
                '';
            _this.model = id && id !== 'new' ? _this.collection.get(id) : new PaymentInstrumentACH_Model_1.PaymentInstrumentACHModel();
            var addCCLabel = Utils.translate('Add ACH');
            var editCCLabel = Utils.translate('Edit ACH');
            _this.title = _this.model.isNew() ? addCCLabel : editCCLabel;
            _this.page_header = _this.title;
            _this.showCardsImgs = true;
            return _this;
        }
        PaymentInstrumentACHEditView.prototype.beforeShowContent = function () {
            var promise = jQuery.Deferred();
            if (this.profileModel.get('isLoggedIn') !== 'T') {
                promise.reject();
                this.application.getLayout().notFound();
            }
            else {
                promise.resolve();
            }
            return promise;
        };
        PaymentInstrumentACHEditView.prototype.getChildViews = function () {
            var _this = this;
            return {
                'ACH.Form': function () {
                    _this.ACHForm = new PaymentInstrumentACH_Edit_Form_View_1.PaymentInstrumentACHEditFormView({
                        model: _this.model,
                        collection: _this.collection,
                        inModal: _this.inModal,
                        isSection: false,
                        noRedirect: false,
                        showFooter: true
                    });
                    return _this.ACHForm;
                }
            };
        };
        PaymentInstrumentACHEditView.prototype.getSelectedMenu = function () {
            return 'ach';
        };
        PaymentInstrumentACHEditView.prototype.showError = function (message, type, closable, disableElements) {
            Environment_1.Environment.getApplication()
                .getLayout()
                .showError(message, type, closable, disableElements);
        };
        PaymentInstrumentACHEditView.prototype.getContext = function () {
            return {
                isNew: this.model.isNew(),
                inModal: this.inModal,
                isCollectionEmpty: !this.collection.length,
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD'
            };
        };
        return PaymentInstrumentACHEditView;
    }(PageTypeView_1.PageTypeView));
    exports.PaymentInstrumentACHEditView = PaymentInstrumentACHEditView;
});

//# sourceMappingURL=PaymentInstrumentACH.Edit.View.js.map
