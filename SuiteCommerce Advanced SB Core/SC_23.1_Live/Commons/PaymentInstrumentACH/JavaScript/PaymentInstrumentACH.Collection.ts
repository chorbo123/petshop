/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentInstrumentACH.Collection"/>

import * as _ from 'underscore';
import { PaymentInstrumentACHModel } from './PaymentInstrumentACH.Model';
import * as Utils from '../../Utilities/JavaScript/Utils';
import * as Backbone from '../../Core/JavaScript/backbone/BackboneExtras';

import { Collection } from '../../Core/JavaScript/Collection';
import { AjaxRequestsKiller } from '../../AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';
import {
    PaymentInstrumentACH,
    CollectionEventsDefinitionACH
} from '../../../ServiceContract/SC/PaymentInstrumentACH/PaymentInstrumentACH';

export class PaymentInstrumentACHCollection extends Collection<
    PaymentInstrumentACHModel,
    {},
    CollectionEventsDefinitionACH<PaymentInstrumentACHCollection>
> {
    public url = (): string =>
        Utils.getAbsoluteUrl('services/PaymentInstrumentACH.Service.ss', false);

    public original: PaymentInstrumentACHCollection | null;

    public model: typeof PaymentInstrumentACHModel = PaymentInstrumentACHModel;

    public constructor(models: PaymentInstrumentACHModel[] = [], options?: never) {
        super(models, options);
        this.original = null;
    }

    public getCollectionForRendering() {
        if (this && !!this.length && !_.findWhere(this.models, { id: '-1' })) {
            const new_payment_method = this.first().clone();
            new_payment_method.set('internalid', '-1');

            this.models.push(new_payment_method);
            this.length = this.models.length;
        }
        return this;
    }

    public sync(
        method: Backbone.SyncMethod,
        model: this,
        options: Backbone.SyncOptions
    ): JQuery.jqXHR<PaymentInstrumentACH> {
        return super.sync(method, model, options).always(() => {
            try {
                if (!this.original) {
                    this.original = super.clone();
                }
            } catch (e) {
                console.error('Error cloning collection.');
            }
        });
    }

    public reset(
        models: PaymentInstrumentACHModel[],
        options?: Backbone.Silenceable
    ): PaymentInstrumentACHModel[] {
        if (!this.original && (_.isArray(models) && models.length > 0)) {
            this.original = super.clone();
        }
        return super.reset(models, options);
    }

    public update(): void {
        super.fetch({
            reset: true,
            killerId: AjaxRequestsKiller.getKillerId()
        });
    }
}
