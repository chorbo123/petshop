/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
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
define(["require", "exports", "./PageTypeSettings.Handler", "../../Common/Controller/HttpResponse", "../../Common/Controller/ServiceController", "../../Common/Controller/RequestErrors"], function (require, exports, PageTypeSettings_Handler_1, HttpResponse_1, ServiceController_1, RequestErrors_1) {
    "use strict";
    var PageTypeSettingsServiceController = /** @class */ (function (_super) {
        __extends(PageTypeSettingsServiceController, _super);
        function PageTypeSettingsServiceController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'PageTypeSettings.ServiceController2';
            _this.PageTypeSettingsHandler = new PageTypeSettings_Handler_1.PageTypeSettingsHandler();
            return _this;
        }
        PageTypeSettingsServiceController.prototype.getById = function (id, params) {
            var record = this.PageTypeSettingsHandler.get(id, params);
            if (!record) {
                throw RequestErrors_1.notFoundError;
            }
            return new HttpResponse_1.HttpResponse(record);
        };
        return PageTypeSettingsServiceController;
    }(ServiceController_1.ServiceController));
    return {
        service: function (ctx) {
            new PageTypeSettingsServiceController(ctx).initialize();
        }
    };
});
