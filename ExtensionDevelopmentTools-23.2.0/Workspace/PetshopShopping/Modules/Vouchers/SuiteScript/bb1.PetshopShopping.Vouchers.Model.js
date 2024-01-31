// @module bb1.PetshopShopping.Vouchers
define(
 'bb1.PetshopShopping.Vouchers.Model',
 [
  'bb1.PetshopShopping.Breeders.Model',
  'bb1.PetshopShopping.BrandReferral.ShareCode.Model',
  'SC.Model',
  'Application',
  'Models.Init',
  'SiteSettings.Model',
  'Utils',
  'underscore'
 ],
 function (
  BreedersModel,
  BrandReferralShareCodeModel,
  SCModel,
  Application,
  ModelsInit,
  SiteSettings,
  Utils,
  _
 )
 {
  'use strict';

  function addParamsToUrl(baseUrl, params)
  {
   // We get the search options from the config file
   if (params && _.keys(params).length)
   {
    var paramString = Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&')		
    ,	join_string = ~baseUrl.indexOf('?') ? '&' : '?';

    return baseUrl + join_string + paramString;
   }
   else
   {
    return baseUrl;
   }
  }

  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.Vouchers',
   
   // @method get
   // @returns {bb1.PetshopShopping.Vouchers.Model.Data}
   get: function (id)
   {
    'use strict';

    if (!ModelsInit.session.isLoggedIn())
     return {}; // throw unauthorizedError;

    var customerId = nlapiGetUser(),
        filters = [
                   //['used', 'is', 'F'], 'and',
                   ['recipient', 'anyof', customerId]
                  ],
        columns = this.getColumnsArray();
        
    if (id)
     filters.push(new nlobjSearchFilter('internalid', null, 'anyof', id));
     
    var result = this.searchHelper(filters, columns, 'all');
    
    
   /*var webServicesUrl = nlapiResolveURL('SUITELET', 'customscript_bb1_wsc_webservices', 'customdeploy_bb1_wsc_webservices', true);

    //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search this.webServicesUrl', this.webServicesUrl);
    // fetch items
    var webServicesParms = {'action': 'get-vouchers', 'customer': customerId},
        webServicesUrl = addParamsToUrl(webServicesUrl, webServicesParms);
        
    //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search webServicesUrl', webServicesUrl);
    var response = nlapiRequestURL(webServicesUrl, null, {'Content-Type': 'application/json'}, 'GET');
    
    var result = JSON.parse(response.getBody() || '{}');
    
    if (id) {
     if (result.vouchers.length)
      result = result.vouchers[0];
     else
      throw notFoundError;
    }

    return result;*/
    
    
    if (id) {
     if (result.vouchers.length)
      result = result.vouchers[0];
     else
      throw notFoundError;
    }

    return result;
   },
   
   getColumnsArray: function ()
   {
    'use strict';

    return [
     new nlobjSearchColumn('datesent').setSort(),
     new nlobjSearchColumn('internalid'),
     new nlobjSearchColumn('code'),
     new nlobjSearchColumn('promotion'),
     new nlobjSearchColumn('used')
    ];
   },
   
   getPromoCodeColumnsArray: function ()
   {
    'use strict';

    return [
     new nlobjSearchColumn('name').setSort(),
     new nlobjSearchColumn('internalid'),
     new nlobjSearchColumn('description'),
     new nlobjSearchColumn('enddate'),
     new nlobjSearchColumn('code'),
     new nlobjSearchColumn('custrecord_bb1_bpp_promotype'),
     new nlobjSearchColumn('custrecord_bb1_bpp_onlinethumbnail')
    ];
   },
   
   searchHelper: function (filters, columns, page)
   {
    'use strict';
    
    var self = this,
        customerId = nlapiGetUser(),
        litters = BreedersModel.getLitters() || [],
        couponCodeLookupByPromoCode = {},
        promoCodeNameSearchFilters = [],
        promotionCodesLookupByName = {},
        promotionCodesLookupById = {},
        breederVoucherLookup = {},
        breederPromoCodeIds = [],
        breederAnnualPromoCodeIds = [],
        breederVouchers = [],
        brandReferralVouchers = [],
        //brandReferrerCouponCodeIds = [],
        brandReferralsByCouponCodeIdLookup = {},
        vouchers = [];
    
    var brandReferrals = this.getBrandReferrals();
    
    _.each(brandReferrals, function(brandReferral) {
     //brandReferrerCouponCodeIds.push(brandReferrer.referrerCouponCodeId);
     brandReferralsByCouponCodeIdLookup[brandReferral.referrerCouponCodeId] = brandReferral;
    });
    
    //var brandReferralProgrammes = this.getBrandReferralProgrammes();
    //var brandReferrerPromotionIds = _.pluck(brandReferralProgrammes, 'referrerPromotionId') || [];
    
    //if (brandReferrerPromotionIds.length)
    // filters = filters.concat(['or', ['promotion', 'anyof', brandReferrerPromotionIds]]);
    
    _.each(litters, function(litter) {
     _.each(litter.petParents, function(petParent) {
      var breederProgramme = petParent.breederProgramme || {brandName: ''};
      
      breederProgramme.breederPromoCode1 && breederPromoCodeIds.push(breederProgramme.breederPromoCode1);
      breederProgramme.breederPromoCode2 && breederPromoCodeIds.push(breederProgramme.breederPromoCode2);
      breederProgramme.breederPromoCodeAnnual && breederPromoCodeIds.push(breederProgramme.breederPromoCodeAnnual);
      breederProgramme.breederPromoCodeAnnual && breederAnnualPromoCodeIds.push(breederProgramme.breederPromoCodeAnnual);
      
      if (petParent.breederCouponCodeIdSent1) {
       var breederVoucher = {
        type: 'single-use',
        internalId: petParent.breederCouponCodeIdSent1,
        title: petParent.firstName + ' has claimed their free bag!',
        code: petParent.breederCouponCodeSent1,
        promotion: {
         internalId: breederProgramme.breederPromoCode1
        }
       };
       
       breederVoucherLookup[petParent.breederCouponCodeIdSent1] = breederVoucher;
       breederVouchers.push(breederVoucher);
      }
      
      if (petParent.breederCouponCodeIdSent2) {
       var breederVoucher = {
        type: 'single-use',
        internalId: petParent.breederCouponCodeIdSent2,
        title: petParent.firstName + ' purchased brand ' + breederProgramme.brandName + '!',
        code: petParent.breederCouponCodeSent2,
        promotion: {
         internalId: breederProgramme.breederPromoCode2
        }
       };
       
       breederVoucherLookup[petParent.breederCouponCodeIdSent2] = breederVoucher;
       breederVouchers.push(breederVoucher);
      }
     });
    });

    var couponCodes = Application.getAllSearchResults('couponcode', filters, columns);
    
    _.each(couponCodes, function (couponCode)
    {
     var couponCodeId = couponCode.getId();
     
     if (!breederVoucherLookup[couponCodeId]) {
      if (promoCodeNameSearchFilters.length)
       promoCodeNameSearchFilters.push('or');
      
      promoCodeNameSearchFilters.push(['name', 'is', couponCode.getValue('promotion')]);
     }
    });
    
    var promoCodeFilters = breederPromoCodeIds.length ? [
                            ['internalid', 'anyof', breederPromoCodeIds], 'or',
                            ['customers', 'anyof', customerId], 'or',
                            promoCodeNameSearchFilters
                           ] : [['customers', 'anyof', customerId]],
        promotionCodes = Application.getAllSearchResults('promotioncode', promoCodeFilters, this.getPromoCodeColumnsArray());

    _.each(promotionCodes, function(promotionCode) {
     promotionCodesLookupById[promotionCode.getId()] = promotionCode;
     promotionCodesLookupByName[promotionCode.getValue('name')] = promotionCode;
    });

    _.each(couponCodes, function (couponCode)
    {
     var couponCodeId = couponCode.getId(),
         promoCodeName = couponCode.getValue('promotion') || '',
         breederCouponCode = breederVoucherLookup[couponCodeId],
         brandReferral = brandReferralsByCouponCodeIdLookup[couponCodeId],
         promotionCodeId = breederCouponCode && breederCouponCode.promotion.internalId || '',
         promotionCode = promotionCodeId && promotionCodesLookupById[promotionCodeId] || promotionCodesLookupByName[promoCodeName];
     
     if (promotionCode)
      promotionCodeId = promotionCode.getId();
     
     //var isBrandReferralCouponCode = !!(promotionCodeId && brandReferrerPromotionIds.indexOf(promotionCodeId) != -1);
     
     var voucher = {
      type: 'single-use',
      internalId: couponCodeId,
      title: brandReferral ? 'Customer ' + brandReferral.referee.name + ' redeemed your referral code!' : breederCouponCode && breederCouponCode.title || 'Exclusive for you:',
      description: promotionCode && promotionCode.getValue('description') || '',
      code: couponCode.getValue('code'),
      enddate: promotionCode && promotionCode.getValue('enddate') || '',
      thumbnailUrl: promotionCode && promotionCode.getText('custrecord_bb1_bpp_onlinethumbnail') || '',
      promotion: {
       internalId: promotionCodeId,
       name: promotionCode && promotionCode.getValue('name')
      },
      used: couponCode.getValue('used') == 'T'
     };
     
     if (promotionCode)
      couponCodeLookupByPromoCode[promotionCodeId] = voucher;
     
     if (brandReferral)
      brandReferralVouchers.push(voucher);
     else if (breederCouponCode)
      _.extend(breederCouponCode, voucher);
     else
      vouchers.push(voucher);
    });
    
    var customerId = nlapiGetUser();
    
    filters = [//new nlobjSearchFilter('used', null, 'is', 'F'),
               new nlobjSearchFilter('customers', null, 'anyof', customerId)];
           
    //if (id)
    // filters.push(new nlobjSearchFilter('internalid', null, 'anyof', id));
     
    //var promotioncodes = Application.getAllSearchResults('promotioncode', filters, this.getPromoCodeColumnsArray());

    _.each(promotionCodes, function (promotionCode)
    {
     var promoCodeId = promotionCode.getId(),
         promoType = promotionCode.getValue('custrecord_bb1_bpp_promotype'),
         endDate = nlapiStringToDate(promotionCode.getValue('enddate'));
     
     if (couponCodeLookupByPromoCode[promoCodeId])
      return true;
     
     var voucher = {
      type: 'multiple-use',
      internalId: promoCodeId,
      title: 'Exclusive for you:',
      description: promotionCode.getValue('description'),
      code: promotionCode.getValue('code'),
      enddate: promotionCode.getValue('enddate'),
      thumbnailUrl: promotionCode.getText('custrecord_bb1_bpp_onlinethumbnail'),
      promotion: {
       id: promoCodeId,
       name: promotionCode.getValue('name')
      },
      used: false
     };
     
     if (breederAnnualPromoCodeIds.indexOf(promoCodeId) != -1)
      breederVouchers.push(voucher);
     else if (breederPromoCodeIds.indexOf(promoCodeId) == -1)
      vouchers.push(voucher);
    });
    
    var brandReferralShareCodes = BrandReferralShareCodeModel.get();
    
    return {
     breederVouchers: breederVouchers,
     brandReferralShareCodes: brandReferralShareCodes,
     brandReferralVouchers: brandReferralVouchers,
     vouchers: vouchers
    };
   },
   
   getBrandReferralProgrammes: function() {
    
    var referralProgrammeFilters = [
                                    ['isinactive', 'is', 'F']
                                   ];
    var referralProgrammeColumns = [
                                    new nlobjSearchColumn('name').setSort(),
                                    new nlobjSearchColumn('custrecord_bb1_brp_brand'),
                                    new nlobjSearchColumn('custrecord_bb1_brp_refereepromocodeid'),
                                    new nlobjSearchColumn('custrecord_bb1_brp_referrerpromocodeid')
                                   ];
    var referralProgrammeSearchResults = Application.getAllSearchResults('customrecord_bb1_brp', referralProgrammeFilters, referralProgrammeColumns);

    return _.map(referralProgrammeSearchResults, function (referralProgrammeSearchResult)
    {
     var referralProgrammeId = referralProgrammeSearchResult.getId();
     
     var referralProgramme = {
      internalId: referralProgrammeId,
      refereePromotionId: referralProgrammeSearchResult.getValue('custrecord_bb1_brp_refereepromocodeid'),
      referrerPromotionId: referralProgrammeSearchResult.getValue('custrecord_bb1_brp_referrerpromocodeid'),
      brand: {
       internalId: referralProgrammeSearchResult.getValue('custrecord_bb1_brp_brand'),
       name: referralProgrammeSearchResult.getText('custrecord_bb1_brp_brand'),
      }
     };
     
     return referralProgramme;
    });
    
   },

   getBrandReferrals: function() {
    
    var customerId = nlapiGetUser();
    var brandReferralFilters = [
                                ['isinactive', 'is', 'F'], 'and',
                                ['custrecord_bb1_brpr_referrer', 'anyof', customerId], 'and',
                                ['custrecord_bb1_brpr_referrerccodeidsent', 'isnotempty', '']
                               ];
    var brandReferralColumns = [
                                new nlobjSearchColumn('name').setSort(),
                                new nlobjSearchColumn('custrecord_bb1_brpr_brp'),
                                new nlobjSearchColumn('custrecord_bb1_brpr_brand'),
                                new nlobjSearchColumn('custrecord_bb1_brpr_referee'),
                                new nlobjSearchColumn('firstname', 'custrecord_bb1_brpr_referee'),
                                new nlobjSearchColumn('custrecord_bb1_brpr_refereepromoso'),
                                new nlobjSearchColumn('custrecord_bb1_brpr_referrerccodeidsent'),
                                new nlobjSearchColumn('custrecord_bb1_brpr_referrerccodesent'),
                                new nlobjSearchColumn('custrecord_bb1_brpr_referrerpromoso'),
                                new nlobjSearchColumn('custrecord_bb1_brpr_referrerpromoclaimed')
                               ];
    var brandReferralSearchResults = Application.getAllSearchResults('customrecord_bb1_brpr', brandReferralFilters, brandReferralColumns);

    return _.map(brandReferralSearchResults, function (brandReferralSearchResult)
    {
     var referralProgrammeId = brandReferralSearchResult.getId();
     
     var referralProgramme = {
      internalId: referralProgrammeId,
      name: brandReferralSearchResult.getValue('name'),
      referrerCouponCodeId: brandReferralSearchResult.getValue('custrecord_bb1_brpr_referrerccodeidsent'),
      referrerCouponCode: brandReferralSearchResult.getValue('custrecord_bb1_brpr_referrerccodesent'),
      referrerPromotionClaimed: brandReferralSearchResult.getValue('custrecord_bb1_brpr_referrerpromoclaimed') == 'T',
      referee: {
       internalId: brandReferralSearchResult.getValue('custrecord_bb1_brpr_referee'),
       name: brandReferralSearchResult.getValue('firstname', 'custrecord_bb1_brpr_referee') || '',
      },
      refereePromotionSalesOrder: {
       internalId: brandReferralSearchResult.getValue('custrecord_bb1_brpr_refereepromoso'),
       name: brandReferralSearchResult.getText('custrecord_bb1_brpr_refereepromoso'),
      },
      referrerPromotionSalesOrder: {
       internalId: brandReferralSearchResult.getValue('custrecord_bb1_brpr_referrerpromoso'),
       name: brandReferralSearchResult.getText('custrecord_bb1_brpr_referrerpromoso'),
      },
      brandReferralProgramme: {
       internalId: brandReferralSearchResult.getValue('custrecord_bb1_brpr_brp'),
       name: brandReferralSearchResult.getText('custrecord_bb1_brpr_brp'),
      },
      brand: {
       internalId: brandReferralSearchResult.getValue('custrecord_bb1_brpr_brand'),
       name: brandReferralSearchResult.getText('custrecord_bb1_brpr_brand'),
      }
     };
     
     return referralProgramme;
    });
    
   }

  });

 }
);
