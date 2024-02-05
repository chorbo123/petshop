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
define("PaymentInstrumentACH.Collection", ["require", "exports", "underscore", "PaymentInstrumentACH.Model", "Utils", "Collection", "AjaxRequestsKiller"], function (require, exports, _, PaymentInstrumentACH_Model_1, Utils, Collection_1, AjaxRequestsKiller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentInstrumentACHCollection = void 0;
    var PaymentInstrumentACHCollection = /** @class */ (function (_super) {
        __extends(PaymentInstrumentACHCollection, _super);
        function PaymentInstrumentACHCollection(models, options) {
            if (models === void 0) { models = []; }
            var _this = _super.call(this, models, options) || this;
            _this.url = function () {
                return Utils.getAbsoluteUrl('services/PaymentInstrumentACH.Service.ss', false);
            };
            _this.model = PaymentInstrumentACH_Model_1.PaymentInstrumentACHModel;
            _this.original = null;
            return _this;
        }
        PaymentInstrumentACHCollection.prototype.getCollectionForRendering = function () {
            if (this && !!this.length && !_.findWhere(this.models, { id: '-1' })) {
                var new_payment_method = this.first().clone();
                new_payment_method.set('internalid', '-1');
                this.models.push(new_payment_method);
                this.length = this.models.length;
            }
            return this;
        };
        PaymentInstrumentACHCollection.prototype.sync = function (method, model, options) {
            var _this = this;
            return _super.prototype.sync.call(this, method, model, options).always(function () {
                try {
                    if (!_this.original) {
                        _this.original = _super.prototype.clone.call(_this);
                    }
                }
                catch (e) {
                    console.error('Error cloning collection.');
                }
            });
        };
        PaymentInstrumentACHCollection.prototype.reset = function (models, options) {
            if (!this.original && (_.isArray(models) && models.length > 0)) {
                this.original = _super.prototype.clone.call(this);
            }
            return _super.prototype.reset.call(this, models, options);
        };
        PaymentInstrumentACHCollection.prototype.update = function () {
            _super.prototype.fetch.call(this, {
                reset: true,
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            });
        };
        return PaymentInstrumentACHCollection;
    }(Collection_1.Collection));
    exports.PaymentInstrumentACHCollection = PaymentInstrumentACHCollection;
});

//# sourceMappingURL=PaymentInstrumentACH.Collection.js.map
