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
define(["require", "exports", "./Case.Schema", "../../../Common/Dao/Dao"], function (require, exports, Case_Schema_1, Dao_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CaseDao = void 0;
    var CaseDao = /** @class */ (function (_super) {
        __extends(CaseDao, _super);
        function CaseDao() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.schema = Case_Schema_1.default;
            return _this;
        }
        return CaseDao;
    }(Dao_1.Dao));
    exports.CaseDao = CaseDao;
});
