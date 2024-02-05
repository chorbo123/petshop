/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("OrderWizard.Module.ACH.Utils", ["require", "exports", "order_wizard_paymentmethod_ach_module.tpl", "Utils", "ExportedModulesNames"], function (require, exports, order_wizard_paymentmethod_ach_module_tpl, Utils, ExportedModulesNames_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrderWizardModuleACHUtils = void 0;
    var OrderWizardModuleACHUtils = /** @class */ (function () {
        function OrderWizardModuleACHUtils() {
        }
        OrderWizardModuleACHUtils.getACHTemplate = function () {
            return (order_wizard_paymentmethod_ach_module_tpl ||
                Utils.requireModules('payment_wizard_paymentmethod_ach_module.tpl'));
        };
        OrderWizardModuleACHUtils.isTemplateAvailable = function () {
            return (ExportedModulesNames_1.isModuleLoaded('order_wizard_paymentmethod_ach_module.tpl') ||
                ExportedModulesNames_1.isModuleLoaded('payment_wizard_paymentmethod_ach_module.tpl'));
        };
        return OrderWizardModuleACHUtils;
    }());
    exports.OrderWizardModuleACHUtils = OrderWizardModuleACHUtils;
});

//# sourceMappingURL=OrderWizard.Module.ACH.Utils.js.map
