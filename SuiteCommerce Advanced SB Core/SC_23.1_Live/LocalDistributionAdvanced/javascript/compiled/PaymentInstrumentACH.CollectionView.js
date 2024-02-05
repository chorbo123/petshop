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
define("PaymentInstrumentACH.CollectionView", ["require", "exports", "backbone_collection_view_cell.tpl", "backbone_collection_view_row.tpl", "CollectionView", "PaymentInstrumentACH.View", "RowView"], function (require, exports, backbone_collection_view_cell_tpl, backbone_collection_view_row_tpl, CollectionView_1, PaymentInstrumentACH_View_1, RowView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentInstrumentACHCollectionView = void 0;
    var PaymentInstrumentACHCollectionView = /** @class */ (function (_super) {
        __extends(PaymentInstrumentACHCollectionView, _super);
        function PaymentInstrumentACHCollectionView(collection, options) {
            var _this = _super.call(this, collection) || this;
            _this.cellTemplate = backbone_collection_view_cell_tpl;
            _this.options = options;
            return _this;
        }
        PaymentInstrumentACHCollectionView.prototype.getCellViewsPerRow = function () {
            return this.options.viewsPerRow || 1;
        };
        PaymentInstrumentACHCollectionView.prototype.getCellViewInstance = function (model) {
            this.options.model = model;
            return new PaymentInstrumentACH_View_1.PaymentInstrumentACHView(this.options);
        };
        PaymentInstrumentACHCollectionView.prototype.getRowViewInstance = function (index) {
            return new RowView_1.RowView({ template: backbone_collection_view_row_tpl });
        };
        PaymentInstrumentACHCollectionView.prototype.getContext = function () {
            return {};
        };
        return PaymentInstrumentACHCollectionView;
    }(CollectionView_1.CollectionView));
    exports.PaymentInstrumentACHCollectionView = PaymentInstrumentACHCollectionView;
});

//# sourceMappingURL=PaymentInstrumentACH.CollectionView.js.map
