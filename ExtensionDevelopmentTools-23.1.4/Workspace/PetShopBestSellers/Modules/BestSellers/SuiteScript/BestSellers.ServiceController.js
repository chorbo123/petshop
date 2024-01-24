define("PetShop.PetShopBestSellers.BestSellers.ServiceController", ["ServiceController"], function (
  ServiceController
) {
  "use strict";

  return ServiceController.extend({
    name: "PetShop.PetShopBestSellers.BestSellers.ServiceController",

    // The values in this object are the validation needed for the current service.
    options: {
      common: {}
    },

    get: function get() {
      var suiteletInternalUrl = nlapiResolveURL('SUITELET', 'customscript_petshop_bestseller_suitelet', 'customdeploy_petshop_bestseller_suitelet', 'external');
      var headers = {
        Accept: 'application/json',
      };
      var responseObj = nlapiRequestURL(suiteletInternalUrl, null, headers);
      var responseStatusCode = parseInt(responseObj.code, 10);

      if (responseStatusCode === 200) {
        return JSON.parse(responseObj.getBody());
      }
      else {
        throw '';
      }
    },

    post: function post() {
      // not implemented
    }
  });
});
