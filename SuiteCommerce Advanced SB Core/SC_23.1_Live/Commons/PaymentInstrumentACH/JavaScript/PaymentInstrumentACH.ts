/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentInstrumentACH"/>

import * as Utils from '../../Utilities/JavaScript/Utils';

import { ApplicationOnline } from '../../../Advanced/SCA/JavaScript/ApplicationOnline';
import { PaymentInstrumentACHListView } from './PaymentInstrumentACH.List.View';
import { PaymentInstrumentACHEditView } from './PaymentInstrumentACH.Edit.View';
import { Configuration } from '../../../Advanced/SCA/JavaScript/Configuration';

export function mountToApp(application: ApplicationOnline) {
    if (
        !(
            Configuration.get('paymentInstrumentACHEnabled') ||
            Configuration.get('checkoutApp.isAchEnabledInCheckout')
        )
    ) {
        return;
    }
    const pageType = application.getComponent('PageType');

    pageType.registerPageType({
        name: 'ACHList',
        routes: ['ach'],
        view: PaymentInstrumentACHListView,
        defaultTemplate: {
            name: 'paymentinstrument_ach_list.tpl',
            displayName: 'ACH Payments',
            thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources(
                'img/default-layout-paymentinstrument-ach-list.png'
            )
        }
    });

    pageType.registerPageType({
        name: 'ACHDetails',
        routes: ['ach/:id'],
        view: PaymentInstrumentACHEditView,
        defaultTemplate: {
            name: 'paymentinstrument_ach_edit.tpl',
            displayName: 'ACH Payment Edit',
            thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources(
                'img/default-layout-paymentinstrument-ach-detail.png'
            )
        }
    });
}
