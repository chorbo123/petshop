/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="OrderWizard.Module.ACH.Utils"/>

import * as order_wizard_paymentmethod_ach_module_tpl from 'order_wizard_paymentmethod_ach_module.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { isModuleLoaded } from '../../../Commons/Core/JavaScript/ExportedModulesNames';

export class OrderWizardModuleACHUtils {
    public static getACHTemplate() {
        return (
            order_wizard_paymentmethod_ach_module_tpl ||
            Utils.requireModules('payment_wizard_paymentmethod_ach_module.tpl')
        );
    }

    public static isTemplateAvailable() {
        return (
            isModuleLoaded('order_wizard_paymentmethod_ach_module.tpl') ||
            isModuleLoaded('payment_wizard_paymentmethod_ach_module.tpl')
        );
    }
}
