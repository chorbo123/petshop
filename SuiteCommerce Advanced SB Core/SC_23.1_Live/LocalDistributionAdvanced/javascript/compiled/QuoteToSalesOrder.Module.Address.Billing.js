/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("QuoteToSalesOrder.Module.Address.Billing", ["require", "exports", "jQuery", "OrderWizard.Module.Address.Billing"], function (require, exports, jQuery, OrderWizardModuleAddressBilling) {
    "use strict";
    var QuoteToSalesOrderModuleAddressBilling = OrderWizardModuleAddressBilling.extend({
        getSelectedAddressByAddress: function (addresses, addressToCompare) {
            return addresses.find(function (address) {
                var temp = (address.get('country') || '') + " " + (address.get('state') ||
                    '') + " " + (address.get('city') || '') + " " + (address.get('zip') || '') + " " + (address.get('addr1') || '') + " " + (address.get('addr2') || '') + " " + (address.get('fullname') || '') + " " + (address.get('company') || '');
                return addressToCompare.replaceAll('-', ' ') === temp;
            });
        },
        getUpdatedSelectedAddress: function () {
            var addresses = this.getAddressCollection();
            var selectedAddress = addresses && addresses.get(this.model.get(this.manage));
            if (!selectedAddress && addresses && addresses.length > 0) {
                selectedAddress = this.getSelectedAddressByAddress(addresses, this.model.get(this.manage));
                if (selectedAddress && selectedAddress.get('internalid')) {
                    this.setAddress(selectedAddress.get('internalid'));
                }
            }
            return selectedAddress;
        },
        isValid: function () {
            if (!this.isActive() || this.tempAddress) {
                return jQuery.Deferred().resolve();
            }
            var selectedAddress = this.getUpdatedSelectedAddress();
            return this.checkSelectedAddress(selectedAddress);
        }
    });
    return QuoteToSalesOrderModuleAddressBilling;
});

//# sourceMappingURL=QuoteToSalesOrder.Module.Address.Billing.js.map
