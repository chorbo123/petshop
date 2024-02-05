/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// PaymentInstrumentACH.ServiceController.js
// ----------------
// Service to manage ACH requests
define('PaymentInstrumentACH.ServiceController', [
    'ServiceController',
    'PaymentInstrumentACH.Model'
], function(ServiceController, PaymentInstrumentACHModel) {
    // @class PaymentInstrumentACH.ServiceController Manage ACH requests
    // @extend ServiceController
    return ServiceController.extend({
        // @property {String} name Mandatory for all ssp-libraries model
        name: 'PaymentInstrumentACH.ServiceController',

        // @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
        // The values in this object are the validation needed for the current service.
        // Can have values for all the request methods ('common' values) and specific for each one.
        options: {
            common: {
                requireLogin: true
            }
        },

        // @method get The call to PaymentInstrumentACH.Service.ss with http method 'get' is managed by this function
        // @return {PaymentInstrumentACH.Model.Attributes || Array<PaymentInstrumentACH.Model.Attributes>}
        get: function() {
            const id = this.request.getParameter('internalid');
            return id ? PaymentInstrumentACHModel.get(id) : PaymentInstrumentACHModel.list() || [];
        },

        // @method post The call to PaymentInstrumentACH.Service.ss with http method 'post' is managed by this function
        // @return {StatusObject}
        post: function() {
            const resultCreate = PaymentInstrumentACHModel.create(this.data);
            const paymentInstrumentACHModel = this.data.consent
                ? PaymentInstrumentACHModel.get(resultCreate)
                : resultCreate;
            this.sendContent(paymentInstrumentACHModel, { status: 201 });
            // Do not return here as we need to output the status 201
        },

        // @method put The call to PaymentInstrumentACH.Service.ss with http method 'put' is managed by this function
        // @return {PaymentInstrumentACH.Model.Attributes}
        put: function() {
            const id = this.request.getParameter('internalid');
            const resultUpdate = PaymentInstrumentACHModel.update(id, this.data);
            return this.data.consent ? PaymentInstrumentACHModel.get(id) : resultUpdate;
        },

        // @method delete The call to PaymentInstrumentACH.Service.ss with http method 'delete' is managed by this function
        // @return {StatusObject}
        delete: function() {
            const id = this.request.getParameter('internalid');
            PaymentInstrumentACHModel.remove(id);
            return { status: 'ok' };
        }
    });
});
