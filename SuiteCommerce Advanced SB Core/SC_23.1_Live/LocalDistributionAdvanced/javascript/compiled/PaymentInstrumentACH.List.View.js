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
define("PaymentInstrumentACH.List.View", ["require", "exports", "paymentinstrument_ach_list.tpl", "Utils", "Configuration", "Profile.Model", "Environment", "PaymentInstrumentACH.CollectionView", "PageTypeView", "JQueryExtras", "AjaxRequestsKiller", "Backbone", "GlobalViews.Confirmation.View"], function (require, exports, paymentinstrument_ach_list_tpl, Utils, Configuration_1, Profile_Model_1, Environment_1, PaymentInstrumentACH_CollectionView_1, PageTypeView_1, JQueryExtras_1, AjaxRequestsKiller_1, Backbone, GlobalViewsConfirmationView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentInstrumentACHListView = void 0;
    var PaymentInstrumentACHListView = /** @class */ (function (_super) {
        __extends(PaymentInstrumentACHListView, _super);
        function PaymentInstrumentACHListView(options) {
            var _this = _super.call(this, options) || this;
            _this.template = paymentinstrument_ach_list_tpl;
            _this.title = Utils.translate('ACH Payments');
            _this.pageHeader = Utils.translate('ACH Payments');
            _this.attributes = {
                id: 'PaymentMethodACHList',
                class: 'PaymentMethodACHListView'
            };
            _this.events = {
                'click [data-action="remove"]': 'removeACH'
            };
            _this.getBreadcrumbPages = function () {
                return [
                    {
                        text: Utils.translate('ACH'),
                        href: '/ach'
                    }
                ];
            };
            _this.profileModel = Profile_Model_1.ProfileModel.getInstance();
            _this.collection = _this.profileModel.get('paymentmethodsach');
            _this.isPaymentInstrumentEnabled = Environment_1.Environment.getSC().ENVIRONMENT.paymentInstrumentEnabled;
            return _this;
        }
        PaymentInstrumentACHListView.prototype.destroy = function () {
            this.collection.off('update', this.renderOrNavigate, this);
            this.collection.off('noconsent', this.updateAndRender, this);
            _super.prototype.destroy.call(this);
        };
        PaymentInstrumentACHListView.prototype.listenCollection = function () {
            this.collection.on('update', this.renderOrNavigate, this);
            this.collection.on('noconsent', this.updateAndRender, this);
        };
        PaymentInstrumentACHListView.prototype.updateAndRender = function () {
            var _this = this;
            return this.updateCollectionList().then(function () { return _this.render(); });
        };
        PaymentInstrumentACHListView.prototype.renderOrNavigate = function () {
            if (this.collection.length &&
                !(this.collection.length === 1 && this.collection.first().get('internalid') === '-1')) {
                this.render();
            }
            else {
                Backbone.history.navigate('#ach/new', { trigger: true });
            }
        };
        PaymentInstrumentACHListView.prototype.getSelectedMenu = function () {
            return 'ach';
        };
        PaymentInstrumentACHListView.prototype.beforeShowContent = function () {
            var _this = this;
            return this.updateCollectionList().then(function () {
                _this.listenCollection();
            });
        };
        PaymentInstrumentACHListView.prototype.updateCollectionList = function () {
            var _this = this;
            var promise = JQueryExtras_1.jQuery.Deferred();
            return this.collection
                .fetch({
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            })
                .then(function () {
                if (!_this.collection.length) {
                    promise.reject();
                    Backbone.history.navigate('#ach/new', { trigger: true });
                }
                else {
                    promise.resolve();
                }
                return promise;
            });
        };
        PaymentInstrumentACHListView.prototype.getPaymentMethodsToShow = function () {
            var payment_methods_to_show;
            if (this.collection && !!this.collection.length) {
                this.collection.remove('-temporal-');
                payment_methods_to_show = this.collection.getCollectionForRendering();
            }
            return payment_methods_to_show ? payment_methods_to_show.models : [];
        };
        PaymentInstrumentACHListView.prototype.getChildViews = function () {
            var _this = this;
            return {
                'ACH.Collection': function () {
                    if (_this.isPaymentInstrumentEnabled) {
                        var viewsPerRow = Configuration_1.Configuration.get('itemsPerRow');
                        if (Utils.isDesktopDevice()) {
                            viewsPerRow = viewsPerRow || 3;
                        }
                        else if (Utils.isTabletDevice()) {
                            viewsPerRow = viewsPerRow || 2;
                        }
                        else {
                            viewsPerRow = viewsPerRow || 1;
                        }
                        if (_this.collection && !!_this.collection.length) {
                            _this.collection.remove('-temporal-');
                            _this.collection = _this.collection.getCollectionForRendering();
                        }
                        return new PaymentInstrumentACH_CollectionView_1.PaymentInstrumentACHCollectionView(_this.collection || [], {
                            collection: _this.collection,
                            hideSelector: true,
                            viewsPerRow: viewsPerRow,
                            showActions: true
                        });
                    }
                    return null;
                }
            };
        };
        PaymentInstrumentACHListView.prototype.removeACH = function (e) {
            e.preventDefault();
            var deleteConfirmationView = new GlobalViewsConfirmationView({
                callBack: this.removeACHFromCollection,
                callBackParameters: {
                    context: this,
                    achId: JQueryExtras_1.jQuery(e.target).data('id')
                },
                title: Utils.translate('Remove ACH'),
                body: Utils.translate('Are you sure you want to remove this ACH?'),
                autohide: true
            });
            this.options.application.getLayout().showInModal(deleteConfirmationView, this.options);
        };
        PaymentInstrumentACHListView.prototype.removeACHFromCollection = function (options) {
            options.context.collection
                .get(options.achId)
                .destroy({ wait: true })
                .then(function () { return options.context.updateAndRender(); });
        };
        PaymentInstrumentACHListView.prototype.getContext = function () {
            return {
                pageHeader: this.pageHeader,
                hasACH: this.collection.length,
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD'
            };
        };
        return PaymentInstrumentACHListView;
    }(PageTypeView_1.PageTypeView));
    exports.PaymentInstrumentACHListView = PaymentInstrumentACHListView;
});

//# sourceMappingURL=PaymentInstrumentACH.List.View.js.map
