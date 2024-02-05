/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentInstrumentACH.Model"/>
/// <reference path="../../Utilities/JavaScript/GlobalDeclarations.d.ts" />

import * as _ from 'underscore';
import { Model, ModelEventsDefinition } from '../../Core/JavaScript/Model';
import { PaymentInstrumentACH } from '../../../ServiceContract/SC/PaymentInstrumentACH/PaymentInstrumentACH';
import * as Utils from '../../Utilities/JavaScript/Utils';
import { AttributeValidationRules, ValidationUtils } from '../../Core/JavaScript/Validator';

interface PaymentInstrumentACHModelEventsDefinition<TModel, TServiceContract>
    extends ModelEventsDefinition<TModel, TServiceContract> {
    add: (model: TModel) => void;
    save: (model: TModel) => void;
    update: (model: TModel) => void;
}

// @class PaymentInstrument.ACH.Model
export class PaymentInstrumentACHModel extends Model<
    PaymentInstrumentACH,
    PaymentInstrumentACH,
    PaymentInstrumentACHModelEventsDefinition<PaymentInstrumentACH, PaymentInstrumentACH>
> {
    protected urlRoot = (): string =>
        Utils.getAbsoluteUrl('services/PaymentInstrumentACH.Service.ss', false);

    protected getValidationRules(): AttributeValidationRules<PaymentInstrumentACH> {
        return {
            account: [val => ValidationUtils.required(val, Utils.translate('Account is required'))],
            paymentmethod: [val => this.validatePaymentMethod(val)],
            accounttype: [
                val => ValidationUtils.required(val, Utils.translate('Account type is required'))
            ],
            routingnumber: [val => this.validateRoutingNumber(val)],
            bankname: [
                val => ValidationUtils.required(val, Utils.translate('Bank name is required'))
            ],
            ownername: [
                val => ValidationUtils.required(val, Utils.translate('Owner name is required'))
            ],
            limit: [val => this.validateLimit(val)]
        };
    }

    protected validateRoutingNumber(val): string {
        return (
            ValidationUtils.required(val, Utils.translate('Routing number is required')) ||
            ValidationUtils.number(val, Utils.translate('Routing number must be numeric'))
        );
    }

    protected validateLimit(val): string {
        return (
            ValidationUtils.required(val, Utils.translate('Limit is required')) ||
            ValidationUtils.number(val, Utils.translate('Limit must be numeric'))
        );
    }

    protected validatePaymentMethod(form): string {
        if (form && _.isUndefined(form.internalid) && form.paymentmethod === '0') {
            return Utils.translate('Please Select an ACH Type');
        }
        return '';
    }

    public constructor(
        attributes: PaymentInstrumentACH = {
            internalid: null,
            account: null,
            ownername: '',
            accounttype: null,
            bankname: '',
            routingnumber: '',
            limit: null,
            paymentmethod: null,
            paymentmethods: null,
            consent: false
        },
        options?: never
    ) {
        super(attributes, options);

        if (!this.get('internalid')) {
            this.set('internalid', this.get('id'));
        }
    }

    public getAccountTypes() {
        return [
            { key: 'CHECKING', name: 'Checking' },
            { key: 'SAVING', name: 'Saving' },
            { key: 'CORPORATE_CHECKING', name: 'Corporate Checking' }
        ];
    }

    public getAccountType() {
        return _.where(this.getAccountTypes(), { key: this.get('accounttype') })[0].name;
    }
}
