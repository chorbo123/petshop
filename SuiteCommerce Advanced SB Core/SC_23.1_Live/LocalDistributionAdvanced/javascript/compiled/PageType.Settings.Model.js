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
define("PageType.Settings.Model", ["require", "exports", "Model", "Utils", "Backbone.CachedModel"], function (require, exports, Model_1, Utils, BackboneCachedModel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageTypeSettingsModel = void 0;
    var PageTypeSettingsModel = /** @class */ (function (_super) {
        __extends(PageTypeSettingsModel, _super);
        function PageTypeSettingsModel(attributes) {
            var _this = _super.call(this) || this;
            // TODO: Once this extends of CachedModel the access to the prototype fetch won't be needed
            _this.originalFetch = BackboneCachedModel.prototype.fetch;
            _this.internalId = '';
            _this.recName = '';
            _this.urlRoot = function () {
                return Utils.addParamsToUrl(Utils.getAbsoluteUrl('services/PageTypeSettings.ss', true), {
                    internalid: _this.internalId,
                    recname: _this.recName
                });
            };
            _this.internalId = attributes.internalId;
            _this.recName = attributes.recName;
            return _this;
        }
        // Overrides fetch so we make sure that the cache is set to true, so we wrap it
        PageTypeSettingsModel.prototype.fetch = function () {
            return this.originalFetch.apply(this, arguments);
        };
        return PageTypeSettingsModel;
    }(Model_1.Model));
    exports.PageTypeSettingsModel = PageTypeSettingsModel;
});

//# sourceMappingURL=PageType.Settings.Model.js.map
