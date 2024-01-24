// @module CheckoutApplication
// @class bb1.PetshopShopping.Checkout.Configuration.Steps.EnhancedPromotions
// The configuration steps so the Checkout wizard shows the enhanced promotions experience
define(
	'bb1.PetshopShopping.Checkout.Configuration.Steps.EnhancedPromotions',
	[
  'bb1.PetshopShopping.Promotions.OrderWizard.Module.FreeItems',
  'bb1.PetshopShopping.Promotions.OrderWizard.Module.UpsellItems',
  'bb1.PetshopShopping.Promotions.OrderWizard.Module.TreatmentItems',
  'bb1.PetshopShopping.Promotions.OrderWizard.Module.MissedPromoItems',
  'bb1.PetshopShopping.Promotions.OrderWizard.Module.SeasonalItems',
  'bb1.PetshopShopping.Promotions.OrderWizard.Module.SaleItems',
  'bb1.PetshopShopping.Promotions.OrderWizard.Module.BottomlessBowlItems',
  'bb1.PetshopShopping.Prescriptions.OrderWizard.Module.PrescriptionItems.BeforeSubmit',
  'bb1.PetshopShopping.Prescriptions.OrderWizard.Module.PrescriptionItems',
  'bb1.PetshopShopping.SmsSubscription.OrderWizard.Module.MobilePhone',
  
  'OrderWizard.Module.MultiShipTo.EnableLink',
		'OrderWizard.Module.CartSummary',
		'OrderWizard.Module.Address.Shipping',
		'OrderWizard.Module.PaymentMethod.GiftCertificates',
		'OrderWizard.Module.PaymentMethod.Selector',
		'OrderWizard.Module.PaymentMethod.PurchaseNumber',
		'OrderWizard.Module.Address.Billing',
		'OrderWizard.Module.RegisterEmail',
		'OrderWizard.Module.ShowPayments',
		'OrderWizard.Module.SubmitButton',
		'OrderWizard.Module.TermsAndConditions',
		'OrderWizard.Module.Confirmation',
		'OrderWizard.Module.RegisterGuest',
		'OrderWizard.Module.PromocodeForm',
		'OrderWizard.Module.PromocodeNotifications',

		'OrderWizard.Module.MultiShipTo.Select.Addresses.Shipping',
		'OrderWizard.Module.MultiShipTo.Package.Creation',
		'OrderWizard.Module.MultiShipTo.Package.List',
		'OrderWizard.Module.NonShippableItems',
		'OrderWizard.Module.MultiShipTo.Shipmethod',
		'OrderWizard.Module.Shipmethod',
		'OrderWizard.Module.ShowShipments',
 	'OrderWizard.Module.CartItems',
		'OrderWizard.Module.CartItems.PickupInStore',
		'OrderWizard.Module.CartItems.Ship',
		'OrderWizard.Module.CartItems.PickupInStore.List',
		'Header.View',
  'SC.Configuration',

  'underscore',
		'Utils'
	],
	function (
  OrderWizardModuleFreeItems,
  OrderWizardModuleUpsellItems,
  OrderWizardModuleTreatmentItems,
  OrderWizardModuleMissedPromoItems,
  OrderWizardModuleSeasonalItems,
  OrderWizardModuleSaleItems,
  OrderWizardModuleBottomlessBowlItems,
  OrderWizardModulePrescriptionItemsBeforeSubmit,
  OrderWizardModulePrescriptionItems,
  SmsSubscriptionOrderWizardModuleMobilePhone,
  
		OrderWizardModuleMultiShipToEnableLink,
		OrderWizardModuleCartSummary,
		OrderWizardModuleAddressShipping,
		OrderWizardModulePaymentMethodGiftCertificates,
		OrderWizardModulePaymentMethodSelector,
		OrderWizardModulePaymentMethodPurchaseNumber,
		OrderWizardModuleAddressBilling,
		OrderWizardModuleRegisterEmail,
		OrderWizardModuleShowPayments,
		OrderWizardModuleSubmitButton,
		OrderWizardModuleTermsAndConditions,
		OrderWizardModuleConfirmation,
		OrderWizardModuleRegisterGuest,
		OrderWizardModulePromocodeForm,
		OrderWizardModulePromocodeNotification,

		OrderWizardModuleMultiShipToSelectAddressesShipping,
		OrderWizardModuleMultiShipToPackageCreation,
		OrderWizardModuleMultiShipToPackageList,
		OrderWizardModuleNonShippableItems,
		OrderWizardModuleMultiShipToShipmethod,
		OrderWizardModuleShipmethod,
		OrderWizardModuleShowShipments,
 	OrderWizardModuleCartItems,
		OrderWizardModuleCartItemsPickupInStore,
		OrderWizardModuleCartItemsShip,
		OrderWizardModuleCartItemsPickupInStoreList,
		HeaderView,
  Configuration,
  
  _,
		Utils
	)
 {
  'use strict';

  var mst_delivery_options = 	{
    is_read_only: false,
   	show_edit_address_url: false,
   	hide_accordion: true,
   	collapse_items: true
   },

  	show_shipment_options = {
    edit_url: '/shipping/address',
   	show_edit_address_url: true,
   	hide_title: true,
   	edit_shipment_url: 'shipping/addressPackages',
   	edit_shipment_address_url: 'shipping/selectAddress',
   	is_read_only: false,
   	show_combo: true,
   	show_edit_button: true,
   	hide_item_link: true
   },

  	cart_summary_options = {
    exclude_on_skip_step: true,
   	allow_remove_promocode: true,
   	container: '#wizard-step-content-right'
    },

  	cart_items_options_right = {
    container: '#wizard-step-content-right',
   	hideHeaders: true,
   	showMobile: true,
   	exclude_on_skip_step: true,
   	showOpenedAccordion: _.isTabletDevice() || _.isDesktopDevice() || false
   },

  	cart_items_non_shippable_options_right = _.extend(
    {
     title: _('Other Items').translate(),
     show_mobile: true,
     show_table_header: false,
     show_edit_cart_button: true
    },

    cart_items_options_right
   );
   
  var defaultCheckoutPromotionsConfig = {
   freeItemsStep: {
    enabled: true,
    title: _('Select Your Freebie').translate()
   },
   upsellItemsStep: {
    enabled: true,
    title: _('Before you go...').translate()
   },
   saleItemsStep: {
    enabled: true,
    title: _('Flash sale! Dentastix only 99p whilst stocks last...').translate(),
    saleItems: [{id: 47162}]
   },
   prescriptionItemsStep: {
    enabled: true,
    title: _('Add Your Pet').translate()
   }
  };
  
  var checkoutPromotionsConfig = _.extend(defaultCheckoutPromotionsConfig, Configuration.get('promotions.checkout', {}));
  
  return [
    {
     name: checkoutPromotionsConfig.freeItemsStep.title,
    	steps: [
      {
       name: checkoutPromotionsConfig.freeItemsStep.heading,
      	url: checkoutPromotionsConfig.freeItemsStep.urlComponent || 'freebies',
       continueButtonLabel: function () {
        return _('No thanks, continue').translate();
       },
      	isActive: function ()
       {
        if (!checkoutPromotionsConfig.freeItemsStep.enabled)
         return false;
        
        var cartContainsFreeItems = !!this.wizard.model.get('lines').find(function(line) {
         return line.get('item').get('custitem_bb1_web_freeitem') === true;
        });
        
        return !cartContainsFreeItems;
       },
      	modules: [
       	[
         OrderWizardModuleFreeItems,
         {
          hide_title: true,
          actionButtonLabel: checkoutPromotionsConfig.freeItemsStep.actionButtonLabel
         }
        ],
       	[OrderWizardModuleCartSummary, cart_summary_options],
       	[
         OrderWizardModuleSubmitButton,
        	{
          container: '#wizard-step-content-right',
         	showWrapper: true,
         	wrapperClass: 'order-wizard-submitbutton-container',
         	exclude_on_skip_step: true,
         	is_below_summary: true
         }
        ],
       	[OrderWizardModulePromocodeForm, cart_items_options_right],
       	[
         OrderWizardModuleCartItemsShip,
        	_.extend(
          {
           show_opened_accordion: _.isDesktopDevice(),
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[
         OrderWizardModuleCartItemsPickupInStore,
        	_.extend(
          {
           show_opened_accordion: false,
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
       ]
      }
     ]
    },
    {
     name: checkoutPromotionsConfig.upsellItemsStep.title,
    	steps: [
      {
       name: checkoutPromotionsConfig.upsellItemsStep.heading,
      	url: checkoutPromotionsConfig.upsellItemsStep.urlComponent || 'before-you-go',
       continueButtonLabel: function () {
        return _('No thanks, continue').translate();
       },
      	isActive: function ()
       {
        return checkoutPromotionsConfig.upsellItemsStep.enabled;
       },
      	modules: [
       	[
         OrderWizardModuleUpsellItems,
         {
          hide_title: true,
          actionButtonLabel: checkoutPromotionsConfig.upsellItemsStep.actionButtonLabel,
          maxItemListsDisplayed: checkoutPromotionsConfig.upsellItemsStep.maxItemListsDisplayed
         }
        ],
       	[OrderWizardModuleCartSummary, cart_summary_options],
       	[
         OrderWizardModuleSubmitButton,
        	{
          container: '#wizard-step-content-right',
         	showWrapper: true,
         	wrapperClass: 'order-wizard-submitbutton-container',
         	exclude_on_skip_step: true,
         	is_below_summary: true
         }
        ],
       	[OrderWizardModulePromocodeForm, cart_items_options_right],
       	[
         OrderWizardModuleCartItemsShip,
        	_.extend(
          {
           show_opened_accordion: _.isDesktopDevice(),
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[
         OrderWizardModuleCartItemsPickupInStore,
        	_.extend(
          {
           show_opened_accordion: false,
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
       ]
      }
     ]
    },
    {
     name: checkoutPromotionsConfig.treatmentItemsStep.title,
    	steps: [
      {
       name: checkoutPromotionsConfig.treatmentItemsStep.heading,
      	url: checkoutPromotionsConfig.treatmentItemsStep.urlComponent || 'flea-wormers',
       continueButtonLabel: function () {
        return _('No thanks, continue').translate();
       },
      	isActive: function ()
       {
        return checkoutPromotionsConfig.treatmentItemsStep.enabled;
       },
      	modules: [
       	[
         OrderWizardModuleTreatmentItems,
         {
          hide_title: true,
          actionButtonLabel: checkoutPromotionsConfig.treatmentItemsStep.actionButtonLabel
         }
        ],
       	[OrderWizardModuleCartSummary, cart_summary_options],
       	[
         OrderWizardModuleSubmitButton,
        	{
          container: '#wizard-step-content-right',
         	showWrapper: true,
         	wrapperClass: 'order-wizard-submitbutton-container',
         	exclude_on_skip_step: true,
         	is_below_summary: true
         }
        ],
       	[OrderWizardModulePromocodeForm, cart_items_options_right],
       	[
         OrderWizardModuleCartItemsShip,
        	_.extend(
          {
           show_opened_accordion: _.isDesktopDevice(),
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[
         OrderWizardModuleCartItemsPickupInStore,
        	_.extend(
          {
           show_opened_accordion: false,
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
       ]
      }
     ]
    },
    {
     name: checkoutPromotionsConfig.missedPromoItemsStep.title,
    	steps: [
      {
       name: checkoutPromotionsConfig.missedPromoItemsStep.heading,
      	url: checkoutPromotionsConfig.missedPromoItemsStep.urlComponent || 'missed-promotions',
       continueButtonLabel: function () {
        return _('No thanks, continue').translate();
       },
      	isActive: function ()
       {
        return checkoutPromotionsConfig.missedPromoItemsStep.enabled;
       },
      	modules: [
       	[
         OrderWizardModuleMissedPromoItems,
         {
          hide_title: true,
          actionButtonLabel: checkoutPromotionsConfig.missedPromoItemsStep.actionButtonLabel
         }
        ],
       	[OrderWizardModuleCartSummary, cart_summary_options],
       	[
         OrderWizardModuleSubmitButton,
        	{
          container: '#wizard-step-content-right',
         	showWrapper: true,
         	wrapperClass: 'order-wizard-submitbutton-container',
         	exclude_on_skip_step: true,
         	is_below_summary: true
         }
        ],
       	[OrderWizardModulePromocodeForm, cart_items_options_right],
       	[
         OrderWizardModuleCartItemsShip,
        	_.extend(
          {
           show_opened_accordion: _.isDesktopDevice(),
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[
         OrderWizardModuleCartItemsPickupInStore,
        	_.extend(
          {
           show_opened_accordion: false,
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
       ]
      }
     ]
    },
    {
     name: checkoutPromotionsConfig.seasonalItemsStep.title,
    	steps: [
      {
       name: checkoutPromotionsConfig.seasonalItemsStep.heading,
      	url: checkoutPromotionsConfig.seasonalItemsStep.urlComponent || 'seasonal',
       continueButtonLabel: function () {
        return _('No thanks, continue').translate();
       },
      	isActive: function ()
       {
        return checkoutPromotionsConfig.seasonalItemsStep.enabled;
       },
      	modules: [
       	[
         OrderWizardModuleSeasonalItems,
         {
          hide_title: true,
          actionButtonLabel: checkoutPromotionsConfig.seasonalItemsStep.actionButtonLabel
         }
        ],
       	[OrderWizardModuleCartSummary, cart_summary_options],
       	[
         OrderWizardModuleSubmitButton,
        	{
          container: '#wizard-step-content-right',
         	showWrapper: true,
         	wrapperClass: 'order-wizard-submitbutton-container',
         	exclude_on_skip_step: true,
         	is_below_summary: true
         }
        ],
       	[OrderWizardModulePromocodeForm, cart_items_options_right],
       	[
         OrderWizardModuleCartItemsShip,
        	_.extend(
          {
           show_opened_accordion: _.isDesktopDevice(),
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[
         OrderWizardModuleCartItemsPickupInStore,
        	_.extend(
          {
           show_opened_accordion: false,
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
       ]
      }
     ]
    },
    {
     name: checkoutPromotionsConfig.saleItemsStep.title,
    	steps: [
      {
       name: checkoutPromotionsConfig.saleItemsStep.heading,
      	url: checkoutPromotionsConfig.saleItemsStep.urlComponent || 'flash-sale',
       continueButtonLabel: function () {
        return _('No thanks, continue').translate();
       },
      	isActive: function ()
       {
        return checkoutPromotionsConfig.saleItemsStep.enabled;
       },
      	modules: [
       	[
         OrderWizardModuleSaleItems,
         {
          hide_title: true,
          actionButtonLabel: checkoutPromotionsConfig.saleItemsStep.actionButtonLabel
         }
        ],
       	[OrderWizardModuleCartSummary, cart_summary_options],
       	[
         OrderWizardModuleSubmitButton,
        	{
          container: '#wizard-step-content-right',
         	showWrapper: true,
         	wrapperClass: 'order-wizard-submitbutton-container',
         	exclude_on_skip_step: true,
         	is_below_summary: true
         }
        ],
       	[OrderWizardModulePromocodeForm, cart_items_options_right],
       	[
         OrderWizardModuleCartItemsShip,
        	_.extend(
          {
           show_opened_accordion: _.isDesktopDevice(),
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[
         OrderWizardModuleCartItemsPickupInStore,
        	_.extend(
          {
           show_opened_accordion: false,
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
       ]
      }
     ]
    },
    {
     name: _('Shipping Address').translate(),
    	steps: [
      {
       name: _('Choose Shipping Address').translate(),
      	url: 'shipping/address',
      	isActive: function ()
       {
        return !this.wizard.isMultiShipTo();
       },
      	modules: [
        [OrderWizardModulePromocodeNotification, {exclude_on_skip_step: true}],
       	[	//Mobile Top
        OrderWizardModuleSubmitButton,
        	{
          className: 'order-wizard-submitbutton-module-top',
         	exclude_on_skip_step: true
         }
        ],
       	OrderWizardModuleMultiShipToEnableLink,
       	OrderWizardModuleAddressShipping,
       	[OrderWizardModuleShipmethod, mst_delivery_options],
        SmsSubscriptionOrderWizardModuleMobilePhone,
       	[OrderWizardModuleCartSummary, cart_summary_options],
       	[
         OrderWizardModuleSubmitButton,
        	{
          container: '#wizard-step-content-right',
         	showWrapper: true,
         	wrapperClass: 'order-wizard-submitbutton-container',
         	exclude_on_skip_step: true,
         	is_below_summary: true
         }
        ],
       	[OrderWizardModulePromocodeForm, cart_items_options_right],
       	[
         OrderWizardModuleCartItemsShip,
        	_.extend(
          {
           show_opened_accordion: _.isDesktopDevice(),
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[
         OrderWizardModuleCartItemsPickupInStore,
        	_.extend(
          {
           show_opened_accordion: false,
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
       ]
      },
     	{
       name: _('Enter Shipping Address').translate(),
      	url: 'shipping/selectAddress',
      	isActive: function ()
       {
        return this.wizard.isMultiShipTo();
       },
      	modules: [
        [OrderWizardModuleMultiShipToEnableLink, {exclude_on_skip_step: true}],
       	[OrderWizardModuleMultiShipToSelectAddressesShipping, {edit_addresses_url: 'shipping/selectAddress' }],
       	[OrderWizardModuleCartSummary, cart_summary_options],
       	[OrderWizardModulePromocodeForm, cart_items_options_right]
       ]
      }
     ]
    },
   	{
     name: _('Set shipments').translate()
    ,	steps: [
      {
       name: _('Set shipments').translate()
      ,	isActive: function ()
       {
        return this.wizard.isMultiShipTo();
       }
      ,	url: 'shipping/addressPackages'
      ,	modules: [
        [OrderWizardModuleMultiShipToEnableLink, {change_url: 'shipping/address'}]
       ,	[OrderWizardModuleMultiShipToPackageCreation, {edit_addresses_url: 'shipping/selectAddress'}]
       ,	OrderWizardModuleMultiShipToPackageList
       ,	OrderWizardModuleNonShippableItems
       ,	[OrderWizardModuleCartSummary, cart_summary_options]
       ,	[OrderWizardModulePromocodeForm, cart_items_options_right]
       ]
      }
     ]
    }
   ,	{
     name: _('Delivery Method').translate()
    ,	steps: [
      {
       name: _('Choose delivery method').translate()
      ,	url: 'shipping/packages'
      ,	isActive: function ()
       {
        return this.wizard.isMultiShipTo();
       }
      ,	modules: [
        [OrderWizardModuleMultiShipToShipmethod, mst_delivery_options]
       ,	[OrderWizardModuleNonShippableItems, mst_delivery_options]
       ,	[OrderWizardModuleCartSummary, cart_summary_options]
       ,	[OrderWizardModulePromocodeForm, cart_items_options_right]
       ]
      }
     ]
    }
   ,	{
     name: _('Payment').translate()
    ,	steps: [
      {
       name: _('Choose Payment Method').translate()
      ,	url: 'billing'
      ,	bottomMessage: _('You will have an opportunity to review your order on the next step.').translate()
      ,	modules: [
        [OrderWizardModulePromocodeNotification, {exclude_on_skip_step: true}]
       ,	[	//Mobile Top
        OrderWizardModuleSubmitButton
        ,	{
          className: 'order-wizard-submitbutton-module-top'
         ,	exclude_on_skip_step: true
         }
        ]
       ,	[OrderWizardModulePaymentMethodSelector, {record_type:'salesorder', prevent_default: true}]
       ,	OrderWizardModulePaymentMethodGiftCertificates
       ,	OrderWizardModulePaymentMethodPurchaseNumber
       ,	[OrderWizardModuleAddressBilling
        ,	{
          enable_same_as: function ()
          {
           return !this.wizard.isMultiShipTo() && this.wizard.model.shippingAddressIsRequired();
          }
         ,	title: _('Enter Billing Address').translate()
         ,	select_shipping_address_url: 'shipping/selectAddress'
         }
        ]
       ,	OrderWizardModuleRegisterEmail
       ,	[OrderWizardModuleCartSummary, cart_summary_options]
       ,	[	OrderWizardModuleSubmitButton
        ,	{
          container: '#wizard-step-content-right'
         ,	showWrapper: true
         ,	wrapperClass: 'order-wizard-submitbutton-container'
         ,	exclude_on_skip_step: true
         ,	is_below_summary: true
         }
        ]
       ,	[OrderWizardModulePromocodeForm, cart_items_options_right]
       ,	[
         OrderWizardModuleCartItemsPickupInStore
        ,	_.extend(
          {
           show_opened_accordion: false
          ,	show_edit_cart_button: true
          ,	show_headers: false
          ,	show_mobile: true
          }
         ,	cart_items_options_right
         )
        ]
       ,	[
         OrderWizardModuleCartItemsShip
        ,	_.extend(
          {
           show_opened_accordion: false
          ,	show_edit_cart_button: true
          ,	show_headers: false
          ,	show_mobile: true
          }
         ,	cart_items_options_right
         )
        ]
       ,	[OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
       ]
      }
     ]
    },
    {
     name: checkoutPromotionsConfig.prescriptionItemsStep.title,
    	steps: [
      {
       name: checkoutPromotionsConfig.prescriptionItemsStep.title,
      	url: checkoutPromotionsConfig.prescriptionItemsStep.urlComponent || 'prescriptions',
      	bottomMessage: _('You will have an opportunity to review your order on the next step.').translate(),
       continueButtonLabel: function () {
        return _('No thanks, I\'ll add my pet details later').translate();
       },
      	isActive: function ()
       {
        if (!checkoutPromotionsConfig.prescriptionItemsStep.enabled)
         return false;
        
        return true;
       },
      	modules: [
       	[
         OrderWizardModulePrescriptionItemsBeforeSubmit,
         {
          hide_title: true
         }
        ],
       	[OrderWizardModuleCartSummary, cart_summary_options],
       	[
         OrderWizardModuleSubmitButton,
        	{
          container: '#wizard-step-content-right',
         	showWrapper: true,
         	wrapperClass: 'order-wizard-submitbutton-container',
         	exclude_on_skip_step: true,
         	is_below_summary: true
         }
        ],
       	[OrderWizardModulePromocodeForm, cart_items_options_right],
       	[
         OrderWizardModuleCartItemsShip,
        	_.extend(
          {
           show_opened_accordion: _.isDesktopDevice(),
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[
         OrderWizardModuleCartItemsPickupInStore,
        	_.extend(
          {
           show_opened_accordion: false,
          	show_edit_cart_button: true,
          	show_headers: false,
          	show_mobile: true
          },
         	cart_items_options_right
         )
        ],
       	[OrderWizardModuleNonShippableItems, cart_items_non_shippable_options_right]
       ]
      }
     ]
    },
   	{
     name: _('Review').translate()
    ,	steps: [
      {
       name: _('Review Your Order').translate()
      ,	url: 'review'
      ,	continueButtonLabel: function () { return this.wizard && this.wizard.isExternalCheckout() ? _('Continue to External Payment').translate() : _('Place Order').translate(); }
      ,	bottomMessage: function () { return this.wizard && this.wizard.isExternalCheckout() ? _('You will be redirected to a secure site to confirm your payment.').translate() : ''; }
      ,	modules: [
        [	//Mobile Top
         OrderWizardModuleTermsAndConditions
        ,	{
          className: 'order-wizard-termsandconditions-module-top'
         }
        ]
       ,	[	//Mobile Top
         OrderWizardModuleSubmitButton
        ,	{
          className: 'order-wizard-submitbutton-module-top'
         ,	exclude_on_skip_step: true
         }
        ]
       ,	[OrderWizardModulePromocodeNotification, {exclude_on_skip_step: true}]
       ,	[
         OrderWizardModuleCartItemsPickupInStoreList
        ,	{
          show_opened_accordion: _.isDesktopDevice()
         ,	is_accordion_primary: true
         ,	show_edit_cart_button: true
         ,	show_headers: false
         ,	show_mobile: true
         }
        ]
       ,	[
         OrderWizardModuleShowShipments
        ,	_.extend(
          _.clone(show_shipment_options)
         ,	{
           // edit_url: false
          }
         )
        ]

       ,	[OrderWizardModuleMultiShipToShipmethod, show_shipment_options]

       ,	[
         OrderWizardModuleNonShippableItems
        ,	{
          show_mobile: false
         ,	show_table_header: true
         ,	show_opened_accordion: _.isDesktopDevice()
         ,	is_accordion_primary: true
         ,	show_edit_cart_button: true
         }
        ]

       ,	[OrderWizardModuleShowPayments, {edit_url_billing: '/billing', edit_url_address: '/billing'}]
       ,	[	//Desktop Bottom
         OrderWizardModuleTermsAndConditions
        ,	{
          className: 'order-wizard-termsandconditions-module-default'
         }
        ]
       ,	[OrderWizardModuleCartSummary, cart_summary_options]
       ,	[	//Desktop Right
         OrderWizardModuleTermsAndConditions
        ,	{
          container: '#wizard-step-content-right'
         ,	className: 'order-wizard-termsandconditions-module-top-summary'
         }
        ]
       ,	[	OrderWizardModuleSubmitButton
        ,	{
          container: '#wizard-step-content-right'
         ,	showWrapper: true
         ,	wrapperClass: 'order-wizard-submitbutton-container'
         ,	exclude_on_skip_step: true
         ,	is_below_summary: true
         }
        ]
       ,	[OrderWizardModulePromocodeForm, cart_items_options_right]
       ,	[
         //Mobile Right Bottom
         OrderWizardModuleTermsAndConditions
        ,	{
          className: 'order-wizard-termsandconditions-module-bottom'
         ,	container: '#wizard-step-content-right'
         }
        ],
        [
         OrderWizardModuleBottomlessBowlItems,
         {
          actionButtonLabel: checkoutPromotionsConfig.bottomlessBowlItemsStep.actionButtonLabel
         }
        ]
       ]
      ,	save: function()
       {

        if (SC.CONFIGURATION.isThreeDSecureEnabled)
        {

         var promise = this.wizard.model.submit();

                        return this.wizard.start3DSecure(promise);
        }
        else
        {

         _.first(this.moduleInstances).trigger('change_label_continue', _('Processing...').translate());

         var self = this
         ,	submit_operation = this.wizard.model.submit();

         submit_operation.always(function ()
         {
          _.first(self.moduleInstances).trigger('change_label_continue');
         });

         return submit_operation;
        }
       }
      }
     ,	{
       url: 'confirmation'
      ,	hideContinueButton: true
      ,	hideBackButton: true
      ,	hideBreadcrumb: true
      ,	headerView: HeaderView
      ,	modules: [
        [OrderWizardModuleConfirmation],
       	[OrderWizardModuleRegisterGuest],
        //[OrderWizardModulePrescriptionItems, {hide_title: true}],
       	[OrderWizardModuleCartSummary, _.extend({hideSummaryItems: true, show_promocode_form: false, allow_remove_promocode: false, isConfirmation: true}, cart_summary_options)],
        [
         OrderWizardModuleBottomlessBowlItems,
         {
          actionButtonLabel: checkoutPromotionsConfig.bottomlessBowlItemsStep.actionButtonLabel
         }
        ]
       ]
      }
     ]
    }
  ];
  
 }
);
