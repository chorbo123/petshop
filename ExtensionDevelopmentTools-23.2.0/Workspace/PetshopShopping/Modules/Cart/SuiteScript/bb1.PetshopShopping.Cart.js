// @module bb1.PetshopShopping.Cart
define(
	'bb1.PetshopShopping.Cart',
	[
  'LiveOrder.Model',
  'Application',
		'Models.Init',
  'Configuration',

		'Utils',
		'underscore'
	],
	function (
  LiveOrderModel,
		Application,
  ModelsInit,
  Configuration,
  
		Utils,
 	_
	)
 {
  'use strict';

  function roundNumber(val, decimalPlaces) {
   if (isNaN(val)) return 0;

   val = parseFloat(val);
   
   if (isNaN(decimalPlaces) || decimalPlaces < 0)
    decimalPlaces = 2;
    
   var multiplier = Math.pow(10, decimalPlaces);
   
   return Math.round(val * multiplier) / multiplier;
  };

  function parsePercent(val) {
   if (_.isEmpty(val)) return 0;

   val = new String(val);
   
   return parseFloat(val.replace(/%/, "")) / 100;
  }

  Application.on('after:SiteSettings.get', function (model, result)
  {
   //console.log('after:SiteSettings.get');
   result.checkout.requireccsecuritycode = 'T';
  });
  
  //Application.on('after:LiveOrder.setPaymentMethods', function (model, result, data)
  LiveOrderModel.setPaymentMethods = function(data)
  {
   //console.log('override LiveOrder.setPaymentMethods');
   
   var gift_certificate_methods = _.where(data.paymentmethods, {type: 'giftcertificate'})
			,	non_certificate_methods = _.difference(data.paymentmethods, gift_certificate_methods);

			// Payment Methods non gift certificate
			if (this.isSecure && non_certificate_methods && non_certificate_methods.length && ModelsInit.session.isLoggedIn2())
			{
				_.each(non_certificate_methods, function (paymentmethod)
				{
					if (paymentmethod.type === 'creditcard' && paymentmethod.creditcard)
					{
						var credit_card = paymentmethod.creditcard
						,	require_cc_security_code = ModelsInit.session.getSiteSettings(['checkout']).checkout.requireccsecuritycode === 'T'
						,	cc_obj = credit_card && {
										ccnumber: credit_card.ccnumber
									,	ccname: credit_card.ccname
									,	ccexpiredate: credit_card.ccexpiredate
									,	expmonth: credit_card.expmonth
									,	expyear:  credit_card.expyear
									,	paymentmethod: {
											internalid: credit_card.paymentmethod.internalid || credit_card.paymentmethod
										,	name: credit_card.paymentmethod.name
										,	creditcard: credit_card.paymentmethod.creditcard ? 'T' : 'F'
										,	ispaypal:  credit_card.paymentmethod.ispaypal ? 'T' : 'F'
										,	key: credit_card.paymentmethod.key
										}
									};

						if (credit_card.internalid !== '-temporal-')
						{
							cc_obj.internalid = credit_card.internalid;
						}
						else
						{
							cc_obj.internalid = null;
							cc_obj.savecard = 'F';
						}

						if (credit_card.ccsecuritycode)
						{
							cc_obj.ccsecuritycode = credit_card.ccsecuritycode;
						}

						if (!require_cc_security_code || require_cc_security_code && credit_card.ccsecuritycode)
						{
							// the user's default credit card may be expired so we detect this using try & catch and if it is we remove the payment methods.
							try
							{
								// if the credit card is not temporal or it is temporal and the number is complete then set payment method.
								if (cc_obj.internalid || (!cc_obj.internalid && !~cc_obj.ccnumber.indexOf('*') ) )
								{
									ModelsInit.order.removePayment();

									var cc_parameter = {
										paymentterms: 'CreditCard',
										creditcard: {
											internalid: cc_obj.internalid
										,	ccsecuritycode: cc_obj.ccsecuritycode
										,	paymentmethod: {
												internalid: cc_obj.paymentmethod.internalid
											}
										}
									}

									if (!cc_obj.internalid) {
										cc_parameter.creditcard.ccnumber = cc_obj.ccnumber;
										cc_parameter.creditcard.ccname = cc_obj.ccname;
										cc_parameter.creditcard.expmonth = cc_obj.expmonth;
										cc_parameter.creditcard.expyear = cc_obj.expyear;
										cc_parameter.creditcard.savecard = cc_obj.savecard;
									}

									ModelsInit.order.setPayment(cc_parameter);

									ModelsInit.context.setSessionObject('paypal_complete', 'F');
								}
							}
							catch (e)
							{
								if (e && e.code && e.code === 'ERR_WS_INVALID_PAYMENT')
								{
									ModelsInit.order.removePayment();
								}
								throw e;
							}

						}
						// if the the given credit card don't have a security code and it is required we just remove it from the order
						else if (require_cc_security_code && !credit_card.ccsecuritycode)
						{
							ModelsInit.order.removePayment();
						}
					}
					else if (paymentmethod.type === 'invoice')
					{
						ModelsInit.order.removePayment();

						try
						{
							ModelsInit.order.setPayment({ paymentterms: 'Invoice' });
						}
						catch (e)
						{
							if (e && e.code && e.code === 'ERR_WS_INVALID_PAYMENT')
							{
								ModelsInit.order.removePayment();
							}
							throw e;
						}

						ModelsInit.context.setSessionObject('paypal_complete', 'F');
					}
					else if (paymentmethod.type === 'paypal')
					{
						if (ModelsInit.context.getSessionObject('paypal_complete') !== 'T')
						{
							ModelsInit.order.removePayment();
							var paypal = _.findWhere(ModelsInit.session.getPaymentMethods(), {ispaypal: 'T'});
							paypal && ModelsInit.order.setPayment({paymentterms: '', paymentmethod: paypal.key});
						}

					}
					else if (paymentmethod.type && ~paymentmethod.type.indexOf('external_checkout'))
					{
						ModelsInit.order.removePayment();

						ModelsInit.order.setPayment({
								paymentmethod: paymentmethod.key
							,	thankyouurl: paymentmethod.thankyouurl
							,	errorurl: paymentmethod.errorurl
						});
					}
					else
					{
						ModelsInit.order.removePayment();
					}
				});
   }
  };
  
  Application.on('after:LiveOrder.get', function (model, result)
  {
   //console.log('after:LiveOrder.get');
   var defaultVatRate = Configuration.get('shoppingcart.defaultVatRate') || 20;
   
   //console.log('defaultVatRate/typeof: ' + defaultVatRate + '/' + (typeof defaultVatRate));
   
   defaultVatRate = (defaultVatRate / 100) + 1;
   
   var summary = result.summary;
   summary.shippingcost *= defaultVatRate;
   summary.shippingcost_formatted = Utils.formatCurrency(summary.shippingcost);
   summary.handlingcost *= defaultVatRate;
   summary.handlingcost_formatted = Utils.formatCurrency(summary.handlingcost);
   summary.discounttotal *= defaultVatRate;
   summary.discounttotal_formatted = Utils.formatCurrency(summary.discounttotal);
   summary.giftcertapplied *= defaultVatRate;
   summary.giftcertapplied_formatted = Utils.formatCurrency(summary.giftcertapplied);
   summary.subtotal = _.reduce(result.lines, function(memo, line) { return line.total + memo; }, 0);
   summary.subtotal_formatted = Utils.formatCurrency(summary.subtotal);
  });
  
  /*Application.on('after:LiveOrder.getShipMethods', function (model, shipmethods, order_fields)
  {
   _.each(shipmethods, function (shipmethod)
   {
    shipmethod.rate /= 1.2;
    shipmethod.rate_formatted = shipmethod.rate ? Utils.formatCurrency(shipmethod.rate) : 'Free!';
   });
  });*/
  
  Application.on('after:LiveOrder.getLines', function (model, lines, order_fields)
  {
   //console.log('after:LiveOrder.getLines');
   var original_lines = {};
   
   _.each(order_fields.items || [], function (original_line)
   {
    original_lines[original_line.orderitemid] = original_line;
   });

   _.each(lines, function (line)
   {
    var	original_line = original_lines[line.internalid] || {},
        tax_rate = parsePercent(original_line.taxrate1) || 0,
        rate = line.rate * (1 + tax_rate),
        amount = line.amount * (1 + tax_rate),
        total = line.total * (1 + tax_rate),
        tax_amount = total * tax_rate;
   
    line.original_rate = original_line.rate;
    line.rate = roundNumber(rate, 4);
    line.rate_formatted = Utils.formatCurrency(line.rate);
    line.original_amount = original_line.amount;
    line.amount = roundNumber(amount, 4);
    line.amount_formatted = Utils.formatCurrency(line.amount);
    line.tax_amount = roundNumber(tax_amount, 4);
    line.tax_amount_formatted = Utils.formatCurrency(line.tax_amount);
    line.tax_rate = original_line.tax_rate;
    line.tax_code = original_line.taxtype1;
    line.total = roundNumber(total, 4);
    line.total_formatted = Utils.formatCurrency(line.total);

   });
  });
  
  Application.on('before:LiveOrder.update', function (model, data)
  {
   //console.log('after:LiveOrder.update');
   if (data && data.options)
    data.options.custbody_bb1_orderplacedon = '1'; // petshop.co.uk
  });
  
  Application.on('after:LiveOrder.confirmationCreateResult', function (model, result, placed_order)
  {
   //console.log('after:LiveOrder.confirmationCreateResult');
   var subtotal = 0;
   result.lines = [];
   for (i = 1; i <= placed_order.getLineItemCount('item'); i++)
   {
    var grossAmount = parseFloat(placed_order.getLineItemValue('item', 'grossamt', i), 10) || 0;
    result.lines.push({
      item: {
        internalid: placed_order.getLineItemValue('item', 'item', i),
        itemDisplay: placed_order.getLineItemValue('item', 'item_display', i)
      },
      quantity: parseInt(placed_order.getLineItemValue('item', 'quantity', i), 10),
      rate: parseFloat(placed_order.getLineItemValue('item', 'rate', i), 10),
      total: grossAmount,
      options: placed_order.getLineItemValue('item', 'options', i)
    });
    subtotal += grossAmount;
   }

   result.summary.subtotal = Utils.toCurrency(subtotal);
   result.summary.subtotal_formatted = Utils.formatCurrency(result.summary.subtotal);
  });
  
  /*Application.on('after:LiveOrder.process3DSecure', function (model, confirmation)
  {
   console.log('after:LiveOrder.process3DSecure', JSON.stringify(confirmation));
  });*/
  
  LiveOrderModel.process3DSecure = _.wrap(LiveOrderModel.process3DSecure, function(originalProcess3DSecure)
  {
   console.log('before originalProcess3DSecure', '.');
   try {
    var confirmation = originalProcess3DSecure.apply(this, _.rest(arguments));
   }
   catch (e) {
    console.log('error in originalProcess3DSecure', e && e.getDetails ? e.getDetails() : e);
    throw e;
   }
   console.log('after originalProcess3DSecure', JSON.stringify(confirmation));
   return confirmation;
  });
  
  LiveOrderModel.submit = _.wrap(LiveOrderModel.submit, function(originalSubmit, threedsecure)
  {
   console.log('before originalSubmit', JSON.stringify(threedsecure));
   try {
    var confirmation = originalSubmit.apply(this, _.rest(arguments));
    //throw nlapiCreateError('UNEXPECTED_ERROR', 'test that shit');
   }
   catch (e) {
    console.log('error in originalSubmit', e && e.getDetails ? e.getCode() + ': ' + e.getDetails() : e);
    //console.log('error this.get()', JSON.stringify(this.get()));
    console.log('error confirmation', JSON.stringify(confirmation));
    var currentCart = this.get() || {lines: []};
    console.log('error this.get().lines.length', currentCart.lines.length);
    
    var errorsToCheckForOrderPlacement = ['UNEXPECTED_ERROR', 'ERR_WS_EMPTY_ORDER', 'ERR_WS_CC_AUTH'];
    
    if (errorsToCheckForOrderPlacement.indexOf(e.getCode()) != -1 && currentCart.lines.length == 0) {
     var timeLimit = errorsToCheckForOrderPlacement.indexOf(e.getCode()) >= 1 ? '60' : '10';
     console.log('Not cart lines. Check if customer has placed an order in the last 10 seconds.', timeLimit);
   
     var	filters = [
      new nlobjSearchFilter('entity', null, 'is', nlapiGetUser()),
      new nlobjSearchFilter('mainline', null, 'is', 'T'),
      //new nlobjSearchFilter('source', null, 'is', 'Web (PetShopBowl Ltd)'),
      //new nlobjSearchFilter('datecreated', null, 'onorafter', 'secondsago10')
      new nlobjSearchFilter('formulatext', null, 'is', 'Web (PetShopBowl Ltd)').setFormula('{source}'),
      new nlobjSearchFilter('formulanumeric', null, 'lessthanorequalto', timeLimit).setFormula('({today} - {datecreated})*24*60*60')
     ];
     var	columns = [
      new nlobjSearchColumn('tranid'),
      new nlobjSearchColumn('memo')
     ];

     var results = Application.getAllSearchResults('salesorder',	filters,	columns) || [];
     
     if (results.length == 1) {
      console.log('Customer has placed an order in the last 10 seconds.', results.length);
      var result = results[0];
      var confirmation = {
       internalid: result.getId(),
       tranid: result.getValue('tranid'),
       confirmationnumber: result.getValue('memo'),
       statuscode:	'success',
       reasoncode:	null
      };
      confirmation = _.extend(this.getConfirmation(confirmation.internalid), confirmation);
      //console.log('after error fix', JSON.stringify(confirmation));
     }
     else {
      console.log('displaying check order submitted message to customer.', '.');
      throw {
       status: 500,
       code: e.getCode(),
       message: 'We encountered an error while processing your payment. PLEASE DO NOT RE-SUBMIT THE ORDER. Please first check your orders in the My Account section to confirm if the order has been placed. If the order is not the top order in the list the you are safe to re-submit your order.'
      };
     }
    }
    else {
     throw e;
    }
   }
   //console.log('after originalSubmit', JSON.stringify(confirmation));
   return confirmation;
  });
  
  LiveOrderModel.removePaypalAddress = function (paypal_address) {};
  
 }
);
