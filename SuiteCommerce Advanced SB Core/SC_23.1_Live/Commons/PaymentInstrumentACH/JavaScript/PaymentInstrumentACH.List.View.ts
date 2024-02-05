/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentInstrumentACH.List.View"/>
/// <reference path="../../Utilities/JavaScript/GlobalDeclarations.d.ts" />

import * as paymentinstrument_ach_list_tpl from 'paymentinstrument_ach_list.tpl';
import * as Utils from '../../Utilities/JavaScript/Utils';
import { Configuration } from '../../../Advanced/SCA/JavaScript/Configuration';
import { ProfileModel } from '../../Profile/JavaScript/Profile.Model';
import { Environment } from '../../Core/JavaScript/Environment';

import { PaymentInstrumentACHCollectionView } from './PaymentInstrumentACH.CollectionView';
import { PaymentInstrumentACHCollection } from './PaymentInstrumentACH.Collection';
import { PaymentInstrumentACHModel } from './PaymentInstrumentACH.Model';

import {
    PageTypeView,
    BreadCrumbPage,
    PageTypeViewOptions
} from '../../Core/JavaScript/PageTypeView';
import { jQuery } from '../../Core/JavaScript/jquery/JQueryExtras';
import { ChildViews } from '../../Core/JavaScript/View';
import { AjaxRequestsKiller } from '../../AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';
import { CollectionEventsDefinitionACH } from '../../../ServiceContract/SC/PaymentInstrumentACH/PaymentInstrumentACH';

import Backbone = require('../../Utilities/JavaScript/backbone.custom');
import GlobalViewsConfirmationView = require('../../GlobalViews/JavaScript/GlobalViews.Confirmation.View');

interface PaymentInstrumentACHListViewContext {
    pageHeader: string;
    hasACH: number;
    showBackToAccount: boolean;
}

export class PaymentInstrumentACHListView extends PageTypeView<
    PaymentInstrumentACHListViewContext,
    CollectionEventsDefinitionACH<PaymentInstrumentACHCollection>
> {
    protected template = paymentinstrument_ach_list_tpl;

    protected title = Utils.translate('ACH Payments');

    protected pageHeader = Utils.translate('ACH Payments');

    public attributes = {
        id: 'PaymentMethodACHList',
        class: 'PaymentMethodACHListView'
    };

    protected collection: PaymentInstrumentACHCollection;

    protected profileModel;

    public isPaymentInstrumentEnabled: boolean;

    public events = {
        'click [data-action="remove"]': 'removeACH'
    };

    public constructor(options: PageTypeViewOptions) {
        super(options);
        this.profileModel = ProfileModel.getInstance();
        this.collection = this.profileModel.get('paymentmethodsach');
        this.isPaymentInstrumentEnabled = Environment.getSC().ENVIRONMENT.paymentInstrumentEnabled;
    }

    public destroy(): void {
        this.collection.off('update', this.renderOrNavigate, this);
        this.collection.off('noconsent', this.updateAndRender, this);
        super.destroy();
    }

    private listenCollection(): void {
        this.collection.on('update', this.renderOrNavigate, this);
        this.collection.on('noconsent', this.updateAndRender, this);
    }

    private updateAndRender() {
        return this.updateCollectionList().then(() => this.render());
    }

    private renderOrNavigate(): void {
        if (
            this.collection.length &&
            !(this.collection.length === 1 && this.collection.first().get('internalid') === '-1')
        ) {
            this.render();
        } else {
            Backbone.history.navigate('#ach/new', { trigger: true });
        }
    }

    public getBreadcrumbPages = (): BreadCrumbPage[] => {
        return [
            {
                text: Utils.translate('ACH'),
                href: '/ach'
            }
        ];
    };

    protected getSelectedMenu(): string {
        return 'ach';
    }

    public beforeShowContent() {
        return this.updateCollectionList().then(() => {
            this.listenCollection();
        });
    }

    public updateCollectionList() {
        const promise = jQuery.Deferred();
        return this.collection
            .fetch({
                killerId: AjaxRequestsKiller.getKillerId()
            })
            .then(() => {
                if (!this.collection.length) {
                    promise.reject();
                    Backbone.history.navigate('#ach/new', { trigger: true });
                } else {
                    promise.resolve();
                }
                return promise;
            });
    }

    public getPaymentMethodsToShow(): PaymentInstrumentACHCollection | [] {
        let payment_methods_to_show;

        if (this.collection && !!this.collection.length) {
            this.collection.remove('-temporal-');
            payment_methods_to_show = this.collection.getCollectionForRendering();
        }
        return payment_methods_to_show ? payment_methods_to_show.models : [];
    }

    protected getChildViews(): ChildViews {
        return {
            'ACH.Collection': (): PaymentInstrumentACHCollectionView => {
                if (this.isPaymentInstrumentEnabled) {
                    let viewsPerRow = Configuration.get('itemsPerRow');

                    if (Utils.isDesktopDevice()) {
                        viewsPerRow = viewsPerRow || 3;
                    } else if (Utils.isTabletDevice()) {
                        viewsPerRow = viewsPerRow || 2;
                    } else {
                        viewsPerRow = viewsPerRow || 1;
                    }

                    if (this.collection && !!this.collection.length) {
                        this.collection.remove('-temporal-');
                        this.collection = this.collection.getCollectionForRendering();
                    }

                    return new PaymentInstrumentACHCollectionView(
                        <PaymentInstrumentACHModel[]>(<unknown>this.collection) || [],
                        {
                            collection: this.collection,
                            hideSelector: true,
                            viewsPerRow: viewsPerRow,
                            showActions: true
                        }
                    );
                }
                return null;
            }
        };
    }

    public removeACH(e): void {
        e.preventDefault();
        const deleteConfirmationView = new GlobalViewsConfirmationView({
            callBack: this.removeACHFromCollection,
            callBackParameters: {
                context: this,
                achId: jQuery(e.target).data('id')
            },
            title: Utils.translate('Remove ACH'),
            body: Utils.translate('Are you sure you want to remove this ACH?'),
            autohide: true
        });
        this.options.application.getLayout().showInModal(deleteConfirmationView, this.options);
    }

    private removeACHFromCollection(options): void {
        options.context.collection
            .get(options.achId)
            .destroy({ wait: true })
            .then(() => options.context.updateAndRender());
    }

    public getContext(): PaymentInstrumentACHListViewContext {
        return {
            pageHeader: this.pageHeader,
            hasACH: this.collection.length,
            showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
        };
    }
}
