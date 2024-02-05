/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="QuoteToSalesOrder.Module.Address.Billing"/>
/// <reference path="../../../Commons/Utilities/JavaScript/UnderscoreExtended.d.ts" />

import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';

import OrderWizardModuleAddressBilling = require('../../OrderWizard.Module.Address/JavaScript/OrderWizard.Module.Address.Billing');

const QuoteToSalesOrderModuleAddressBilling: any = OrderWizardModuleAddressBilling.extend({
    getSelectedAddressByAddress: function(addresses, addressToCompare) {
        return addresses.find(address => {
            const temp = `${address.get('country') || ''} ${address.get('state') ||
                ''} ${address.get('city') || ''} ${address.get('zip') || ''} ${address.get(
                'addr1'
            ) || ''} ${address.get('addr2') || ''} ${address.get('fullname') || ''} ${address.get(
                'company'
            ) || ''}`;
            return addressToCompare.replaceAll('-', ' ') === temp;
        });
    },
    getUpdatedSelectedAddress: function() {
        const addresses = this.getAddressCollection();
        let selectedAddress = addresses && addresses.get(this.model.get(this.manage));

        if (!selectedAddress && addresses && addresses.length > 0) {
            selectedAddress = this.getSelectedAddressByAddress(
                addresses,
                this.model.get(this.manage)
            );
            if (selectedAddress && selectedAddress.get('internalid')) {
                this.setAddress(selectedAddress.get('internalid'));
            }
        }
        return selectedAddress;
    },
    isValid: function() {
        if (!this.isActive() || this.tempAddress) {
            return jQuery.Deferred().resolve();
        }

        const selectedAddress = this.getUpdatedSelectedAddress();
        return this.checkSelectedAddress(selectedAddress);
    }
});

export = QuoteToSalesOrderModuleAddressBilling;
