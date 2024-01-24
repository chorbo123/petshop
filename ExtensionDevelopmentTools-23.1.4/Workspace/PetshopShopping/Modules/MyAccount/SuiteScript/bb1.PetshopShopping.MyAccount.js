//@module bb1.PetshopShopping.MyAccount
define(
 'bb1.PetshopShopping.MyAccount',
 [
  'OrderHistory.Model',
  'Application',
  'Configuration',
  'Utils',
  'SC.Model',
  'Models.Init',

  'underscore'
 ],
 function (
  OrderHistoryModel,
  Application,
  Configuration,
  Utils,
  SCModel,
  ModelsInit,

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

 function setCustomStatus(result) {
 
  //console.log('status: ' + JSON.stringify(result.status));
  //console.log('shipmethod: ' + JSON.stringify(result.shipmethod));
  //console.log('shipmethods: ' + JSON.stringify(result.shipmethods));

  var shipMethodId = result.shipmethod && result.shipmethod.internalid || result.shipmethod; //41837
  //var shipMethodName = this.model.get('shipmethods').get(shipMethodId).name; //41837
   
  if (shipMethodId == "41837") {
   if (result.status.internalid == 'pendingFulfillment') {
    result.status.name = 'Your order is getting ready for Collection';
   }
   if (result.status.internalid == 'pendingBilling' || result.status.internalid == 'billed') {
    var bigCCustomerMessage = result.custbody_bb1_bigc_message;
    var collected = /Collected/i.test(bigCCustomerMessage);
    
    result.status.name = collected ? 'Collected' : 'Your order is ready to collect';
   }
  }
  else {
   var shipMethod = shipMethodId && result.shipmethods && _.findWhere(result.shipmethods, {internalid: shipMethodId});
   var shipMethodName = shipMethod && shipMethod.name || shipMethodId && shipMethodId.name || '';

   //console.log(shipMethodName);
   if (result.status.internalid == 'pendingFulfillment') {
    result.status.name = 'In our warehouse getting ready for dispatch';
   }
   if (result.status.internalid == 'pendingBilling' || result.status.internalid == 'billed') {
    result.status.name = 'Dispatched with ' + shipMethodName;
   }
  }
    
 }
 
 Application.on('after:OrderHistory.setExtraListColumns', function (model)
 {
  //console.log('after:OrderHistory.setExtraListColumns');
  model.columns.bigcmessage = new nlobjSearchColumn('custbody_bb1_bigc_message');
  model.columns.shipmethod = new nlobjSearchColumn('shipmethod');
  
  //console.log(JSON.stringify(Object.keys(model)));
 });
 
 Application.on('after:OrderHistory.mapListResult', function (model, result, result2, record)
 {
  //console.log('after:OrderHistory.mapListResult');
  result.custbody_bb1_bigc_message = record.getValue('custbody_bb1_bigc_message');
  result.shipmethod = {
   internalid: record.getValue('shipmethod'),
   name: record.getText('shipmethod')
  };
  setCustomStatus(result);
  //console.log(record.getValue('custbody_bb1_bigc_message'));
 });
 
 Application.on('after:OrderHistory.getExtraRecordFields', function (model)
 {
  //console.log('after:OrderHistory.getExtraRecordFields');
  model.result.custbody_bb1_bigc_message = model.record.getFieldValue('custbody_bb1_bigc_message');
  //console.log(model.record.getFieldValue('custbody_bb1_bigc_message'));
 });
 
  Application.on('after:Transaction.get', function (model, result)
  {
   //console.log('after:Transaction.get');
   var defaultVatRate = Configuration.get('shoppingcart.defaultVatRate') || 20;
   
   //console.log('defaultVatRate/typeof: ' + defaultVatRate + '/' + (typeof defaultVatRate));
   
   setCustomStatus(result);
   
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
  
  Application.on('after:Transaction.getExtraLineFields', function (model, result, line, record, lineid)
  {
   //console.log('after:Transaction.getExtraLineFields');
   
    var	tax_rate = parsePercent(line.tax_rate) || 0,
        rate = line.rate * (1 + tax_rate),
        amount = line.amount * (1 + tax_rate),
        total = line.total * (1 + tax_rate),
        tax_amount = total * tax_rate,
        blbId = record.getLineItemValue('item', 'custcol_bb1_blbi_blbi', lineid);
   
    line.original_rate = line.rate;
    line.rate = roundNumber(rate, 4);
    line.rate_formatted = Utils.formatCurrency(line.rate);
    line.original_amount = line.amount;
    line.amount = roundNumber(amount, 4);
    line.amount_formatted = Utils.formatCurrency(line.amount);
    line.tax_amount = roundNumber(tax_amount, 4);
    line.tax_amount_formatted = Utils.formatCurrency(line.tax_amount);
    line.custcol_bb1_blbi_blbi = blbId;
    //line.tax_rate = original_line.tax_rate;
    //line.tax_code = original_line.taxtype1;
    //line.total = roundNumber(total, 4);
    //line.total_formatted = Utils.formatCurrency(line.total);

  });
  
});
