define("PetShop.EmailDetection.EmailDetection.ServiceController", ["ServiceController"], function (
  ServiceController
) {
  "use strict";

  return ServiceController.extend({
    name: "PetShop.EmailDetection.EmailDetection.ServiceController",

    // The values in this object are the validation needed for the current service.
    options: {
      common: {}
    },

    get: function get() {
      var email = this.request.getParameter('email');
      var suiteletInternalUrl = nlapiResolveURL('SUITELET', 'customscript_petshop_emai_duplicate', 'customdeploy_petshop_emai_duplicate', 'external');
      var headers = {
        Accept: 'application/json',
      };
      var responseObj = nlapiRequestURL(suiteletInternalUrl, email, headers);
      var responseStatusCode = parseInt(responseObj.code, 10);

      if (responseStatusCode === 200) {
        return responseObj.getBody();
      }
      else {
        throw '';
      }
    },

    post: function post() {
      // not implemented
    },

    put: function put() {
      // not implemented
    },

    delete: function () {
      // not implemented
    }
  });
});
