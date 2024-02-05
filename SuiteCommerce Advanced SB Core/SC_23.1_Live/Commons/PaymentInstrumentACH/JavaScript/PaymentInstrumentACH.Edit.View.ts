/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentInstrumentACH.Edit.View"/>

import * as _ from 'underscore';
import * as paymentinstrument_ach_edit_tpl from 'paymentinstrument_ach_edit.tpl';
import * as Utils from '../../Utilities/JavaScript/Utils';
import * as jQuery from '../../Core/JavaScript/jQuery';
import { Configuration } from '../../Utilities/JavaScript/Configuration';
import { ProfileModel } from '../../Profile/JavaScript/Profile.Model';
import { PaymentInstrumentACHModel } from './PaymentInstrumentACH.Model';
import { PaymentInstrumentACHCollection } from './PaymentInstrumentACH.Collection';
import { PaymentInstrumentACHEditFormView } from './PaymentInstrumentACH.Edit.Form.View';

import { ChildViews } from '../../Core/JavaScript/View';
import {
    BreadCrumbPage,
    PageTypeView,
    PageTypeViewOptions
} from '../../Core/JavaScript/PageTypeView';

import { Environment } from '../../Core/JavaScript/Environment';

interface PaymentInstrumentACHEditViewContext {
    isNew: boolean;
    isCollectionEmpty: boolean;
    inModal: boolean;
    showBackToAccount: boolean;
}

export class PaymentInstrumentACHEditView extends PageTypeView<
    PaymentInstrumentACHEditViewContext
> {
    public application;

    private ACHForm: PaymentInstrumentACHEditFormView = null;

    protected template = paymentinstrument_ach_edit_tpl;

    protected profileModel = null;

    public title = '';

    public page_header = '';

    public showCardsImgs = true;

    public showDefaults = false;

    public options;

    public noRedirect = false;

    public attributes = {
        id: 'PaymentInstrumentACHDetails',
        class: 'PaymentInstrumentACHView'
    };

    public collection: PaymentInstrumentACHCollection;

    public model: PaymentInstrumentACHModel;

    public constructor(options: PageTypeViewOptions) {
        super(options);
        this.options = options;
        this.application = options.application;
        this.profileModel = ProfileModel.getInstance();
        this.collection =
            this.profileModel.get('paymentmethodsach') || new PaymentInstrumentACHCollection();

        const id =
            (options.routerArguments &&
                options.routerArguments.length &&
                options.routerArguments[0]) ||
            '';

        this.model = id && id !== 'new' ? this.collection.get(id) : new PaymentInstrumentACHModel();

        const addCCLabel = Utils.translate('Add ACH');
        const editCCLabel = Utils.translate('Edit ACH');
        this.title = this.model.isNew() ? addCCLabel : editCCLabel;
        this.page_header = this.title;
        this.showCardsImgs = true;
    }

    public beforeShowContent() {
        const promise = jQuery.Deferred();

        if (this.profileModel.get('isLoggedIn') !== 'T') {
            promise.reject();
            this.application.getLayout().notFound();
        } else {
            promise.resolve();
        }
        return promise;
    }

    protected getChildViews(): ChildViews {
        return {
            'ACH.Form': (): PaymentInstrumentACHEditFormView => {
                this.ACHForm = new PaymentInstrumentACHEditFormView({
                    model: this.model,
                    collection: this.collection,
                    inModal: this.inModal,
                    isSection: false,
                    noRedirect: false,
                    showFooter: true
                });
                return this.ACHForm;
            }
        };
    }

    protected getSelectedMenu(): string {
        return 'ach';
    }

    public getBreadcrumbPages = (): BreadCrumbPage[] => {
        return [
            {
                text: Utils.translate('ACH'),
                href: '/ach'
            },
            {
                text: this.title,
                href: '/ach/new'
            }
        ];
    };

    private showError(message, type?, closable?, disableElements?) {
        Environment.getApplication()
            .getLayout()
            .showError(message, type, closable, disableElements);
    }

    public getContext(): PaymentInstrumentACHEditViewContext {
        return {
            isNew: this.model.isNew(),
            inModal: this.inModal,
            isCollectionEmpty: !this.collection.length,
            showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
        };
    }
}
