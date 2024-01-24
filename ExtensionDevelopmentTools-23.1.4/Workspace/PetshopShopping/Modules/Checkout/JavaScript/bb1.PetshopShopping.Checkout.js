//@module bb1.PetshopShopping.Checkout
define(
 'bb1.PetshopShopping.Checkout',
 [
  'OrderWizard.Router',
  'OrderWizard.Module.Confirmation',
  'OrderWizard.Module.Shipmethod',
  'OrderWizard.Module.PaymentMethod.ThreeDSecure',
  'LiveOrder.Model',
  'Profile.Model',
  'Tracker',
  'SC.Configuration',
  'GoogleTagManager',
 
  'Backbone.CollectionView',
  'Backbone',
  'underscore'
 ],
 function (
  OrderWizardRouter,
  OrderWizardModuleConfirmation,
  OrderWizardModuleShipmethod,
  OrderWizardThreeDSecure,
  LiveOrderModel,
  ProfileModel,
  Tracker,
  Configuration,
  GoogleTagManager,
  
  BackboneCollectionView,
  Backbone,
  _
 )
 {
  'use strict';
  
  //ProfileModel.getPromise().done(function(user) {
  //console.log(user);
  //if (user.internalid == '80423') {
   //SC.CONFIGURATION.checkoutApp.checkoutSteps = 'bb1.PetshopShopping.Checkout.Configuration.Steps.EnhancedPromotions.Staging';
  //}
  //});
   
  OrderWizardModuleConfirmation.prototype.getContext = _.wrap(OrderWizardModuleConfirmation.prototype.getContext, function(originalGetContext) {
   var context = originalGetContext.apply(this, _.rest(arguments));
   
   _.extend(context, {
    customer: this.wizard.profileModel
   });
   
   console.log('OrderWizardModuleConfirmation.prototype.getContext');
   console.log(context);
   
   return context;
  });
   
  OrderWizardModuleConfirmation.prototype.trackTransaction = _.wrap(OrderWizardModuleConfirmation.prototype.trackTransaction, function(originalTrackTransaction, confirmation) {
   
			var summary = confirmation.get('summary')
			,	transaction = {
					confirmationNumber: confirmation.get('tranid')
				,	subTotal: summary.subtotal
				,	total: summary.total
				,	taxTotal: summary.taxtotal
				,	shippingCost: summary.shippingcost
				,	handlingCost: summary.handlingcost
				,	products: new Backbone.Collection()
				,	promocodes: confirmation.get('promocodes')
				}
			,	transactionModel = new Backbone.Model(transaction);

			confirmation.get('lines').each(function(line)
			{
				var options = [];

				line.get('options').each(function (option)
				{
     var value = option && option.get('value') || {};
     
					if (value.label)
					{
						options.push(value.label);
					}
				});

				transactionModel.get('products').add(new Backbone.Model({
					name: line.get('item').get('_name')
				,	id: line.get('item').get('itemid')
				,	rate: line.get('rate')
				,	category: '/' + line.get('item').get('urlcomponent')
				,	options: options.sort().join(', ')
				,	quantity: line.get('quantity')
				}));
			});

			Tracker.getInstance().trackTransaction(transactionModel);
		});
  
  _.extend(OrderWizardRouter.prototype, {
  
   start3DSecure: _.wrap(OrderWizardRouter.prototype.start3DSecure, function(originalStart3DSecure, promise)
   {
    //var promise = originalStart3DSecure.apply(this, _.rest(arguments)),
    var self = this,
     wrapper_deferred = new jQuery.Deferred();

    promise.done(function() {

     var confirmation = self.model.get('confirmation')
     ,	statuscode = confirmation.get('statuscode')
     ,	success = false;

     if (statuscode) {
      if(statuscode === 'success') {
       wrapper_deferred.resolveWith(this);
       success = true;
      }
      else if(statuscode === 'error') {
       // Order is not success since payment authorization is required
       if (confirmation.get('reasoncode') && confirmation.get('reasoncode') === 'ERR_WS_REQ_PAYMENT_AUTHORIZATION') {
        if (confirmation.get('paymentauthorization')) {
         var view = new OrderWizardThreeDSecure({
          layout: self.application.getLayout(),
          application: self.application,
          wizard: self,
          deferred: wrapper_deferred
         });
         view.showInModal();
         success = true;
        }
       }
      }
     }

     if (!success) {
      wrapper_deferred.rejectWith(this);
     }
    }).fail (function () {
     //wrapper_deferred.rejectWith(this);
     console.log('dont do it!');
    });

    return wrapper_deferred.promise();
   })
   
  });
  
 }
);
