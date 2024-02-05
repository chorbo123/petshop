/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentInstrumentACH.View"/>

import * as _ from 'underscore';
import * as paymentinstrument_ach_tpl from 'paymentinstrument_ach.tpl';
import { View } from '../../Core/JavaScript/View';
import { PaymentInstrumentACHModel } from './PaymentInstrumentACH.Model';
import { PaymentInstrumentACHCollection } from './PaymentInstrumentACH.Collection';
import { CollectionEventsDefinitionACH } from '../../../ServiceContract/SC/PaymentInstrumentACH/PaymentInstrumentACH';

interface PaymentInstrumentACHViewContext {
    achId: number | string;
    showACHImage: boolean;
    paymentMethodImageUrl: string;
    paymentName: string;
    endingAccount: string;
    bankName: string;
    showSelect: boolean;
    selectMessage: string;
    isSelected: boolean | string;
    showSelector: boolean;
    ownerName: string;
    customerConsent: string;
    showActions: boolean;
    limit: string;
    accountType: string;
    routingNumber: string;
    isNewPaymentMethod: boolean;
}

export interface PaymentInstrumentACHViewOptions {
    collection?: PaymentInstrumentACHCollection;
    showActions?: boolean;
    hideSelector?: boolean;
    selectedACHId?: any;
    showSelect?: boolean;
    selectMessage?: string;
    model?: PaymentInstrumentACHModel;
    viewsPerRow?: number;
    childViewOptions?: object;
}

export class PaymentInstrumentACHView extends View<
    PaymentInstrumentACHViewContext,
    CollectionEventsDefinitionACH<PaymentInstrumentACHCollection>
> {
    private readonly options: PaymentInstrumentACHViewOptions;
    private model: PaymentInstrumentACHModel;
    protected template = paymentinstrument_ach_tpl;

    public constructor(options: PaymentInstrumentACHViewOptions) {
        super();
        this.options = options;
        this.model = options.model;
    }

    public getContext(): PaymentInstrumentACHViewContext {
        const accountType = this.model.getAccountType ? this.model.getAccountType() : '';

        const icon =
            this.model.get('paymentmethod').imagesrc && this.model.get('paymentmethod').imagesrc[0];
        const isSelected =
            this.options.hideSelector ||
            this.model.get('internalid') === this.options.selectedACHId;
        const mask = this.model.get('mask');
        const bankName = this.model.get('bankname')
            ? this.model.get('bankname')
            : this.model.get('routingnumber');

        return {
            // @property {String} achId
            achId: this.model.get('internalid'),
            // @property {String} showACHImage
            showACHImage: !!icon,
            // @property {String} paymentMethodImageUrl
            paymentMethodImageUrl: icon || '',
            // @property {String} paymentName
            paymentName: this.model.get('paymentmethod').name,
            // @property {String} endingAccount
            endingAccount: mask.substring(mask.length - 4) || '',
            // @property {String} bankName
            bankName: bankName,
            // @property {Boolean} showDefaults
            showSelect: !!this.options.showSelect,
            // @property {String} selectMessage
            selectMessage: this.options.selectMessage,
            // @property {Boolean} isSelected
            isSelected: isSelected,
            // @property {Boolean} showActions
            showActions: !!this.options.showActions,
            // @property {Boolean} showSelector
            showSelector: !this.options.hideSelector,
            // @property {String} ownerName
            ownerName: this.model.get('ownername'),
            // @property {String} customerConsent
            customerConsent: this.model.get('customerconsent'),
            // @property {String} limit
            limit: this.model.get('limit'),
            // @property {String} accountType
            accountType: accountType,
            // @property {String} routingNumber
            routingNumber: this.model.get('routingnumber'),
            // @property {Boolean} isNewPaymentMethod
            isNewPaymentMethod: this.model.get('internalid') < 0
        };
    }
}
