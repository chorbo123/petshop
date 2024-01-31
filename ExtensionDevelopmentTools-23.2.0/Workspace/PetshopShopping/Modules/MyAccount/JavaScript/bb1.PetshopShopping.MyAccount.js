//@module bb1.PetshopShopping.MyAccount
define(
 'bb1.PetshopShopping.MyAccount',
 [
  'Transaction.Line.Model',
  'ProductLine.Common',
  'Overview',
  'OrderHistory',
  'TransactionHistory',
  'ReorderItems',
  'Invoice',
  'Balance',
  'Address',
  'PaymentMethod',
  'ReturnAuthorization',
  'MyAccount.Profile',
  'ProductList',
  'ProductList.Utils',
  'MenuTree.View',
  'Overview.Home.View',
  'OrderHistory.List.View',
  'OrderHistory.Details.View',
  'OrderHistory.Item.Actions.View',
  'Profile.Model',
  'Session',
  'SC.Configuration',
  
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  TransactionLineModel,
  ProductLineCommon,
  Overview,
  OrderHistory,
  TransactionHistory,
  ReorderItems,
  Invoice,
  Balance,
  Address,
  PaymentMethod,
  ReturnAuthorization,
  MyAccountProfile,
  ProductList,
  ProductListUtils,
  MenuTreeView,
  OverviewHomeView,
  OrderHistoryListView,
  OrderHistoryDetailsView,
  OrderHistoryItemActionsView,
  ProfileModel,
  Session,
  Configuration,
  
  Backbone,
  _,
  Utils
 )
{
 'use strict';
 
  delete Overview.MenuItems;
  delete Balance.MenuItems;
  delete Invoice.MenuItems;
  delete ReorderItems.MenuItems;
  delete TransactionHistory.MenuItems;

  MyAccountProfile.MenuItems = [
   {
    id: 'settings'
   ,	name: _('Your Profile').translate()
   ,	index: 6
   ,	children:
    [
     {
      id: 'profileinformation'
     ,	name: _('Profile Information').translate()
     ,	url: 'profileinformation'
     ,	index: 1
     }
    ,	{
      id: 'emailpreferences'
     ,	name: _('Contact Preferences').translate()
     ,	url: 'emailpreferences'
     ,	index: 2
     }
    ,	{
      id: 'updateyourpassword'
     ,	name: _('Update your Password').translate()
     ,	url: 'updateyourpassword'
     ,	index: 5
     }
    ]
   }
  ];

  Address.MenuItems = {
   parent: 'settings'
  ,	id: 'addressbook'
  ,	name: _('Address Book').translate()
  ,	url: 'addressbook'
  ,	index: 3
  };

  PaymentMethod.MenuItems = {
			parent: 'settings'
		,	id: 'paymentmethod'
		,	name: _('Payment Details').translate()
		,	url: 'paymentmethods'
		,	index: 4
		};
  console.log('ReturnAuthorization');
  console.log(ReturnAuthorization);
  ReturnAuthorization.MenuItems = function () 
		{
			var isSCISIntegrationEnabled = Configuration.get('siteSettings.isSCISIntegrationEnabled', false);

			return {
				id: 'returns'
			,	name: _('Your Returns').translate()
			,	url: 'returns'
			,	index: 5
			,	permission: isSCISIntegrationEnabled ? 'transactions.tranFind.1,transactions.tranPurchasesReturns.1' : 'transactions.tranFind.1,transactions.tranRtnAuth.1'
			};
		};
  
  OrderHistory.MenuItems = function() {
			var isSCISIntegrationEnabled = Configuration.get('siteSettings.isSCISIntegrationEnabled', false);

			return {
				id: 'purchases'
			,	name: _('Your Orders').translate()
			,	index: 1
			,	permission: isSCISIntegrationEnabled ? 'transactions.tranFind.1,transactions.tranPurchases.1' : 'transactions.tranFind.1,transactions.tranSalesOrd.1'
			,	url: 'purchases'
			};
		};
  
  ProductList.MenuItems = function(application) {
   if (!application.ProductListModule.Utils.isProductListEnabled())
   {
    return undefined;
   }

   var loadingList =  _('Loading your wishlist...').translate();
   var	loadingLists = _('Loading your wishlists...').translate();

   return {
    id: 'product_list_dummy_bb1'
   ,	name: application.ProductListModule.Utils.isSingleList() ? loadingList : loadingLists
   ,	url: ''
   ,	index: 2
   };
  };
  //MenuTreeView.getInstance().updateMenuItemsUI();
  
  console.log('ProductListUtils');
  console.log(ProductListUtils);
  
  /*ProductListUtils.productListsPromiseDone = function ()
  {
   console.log('ProductListUtils.productListsPromiseDone override!');
   // Replace dummy menu item from My Account
   var layout = SC._applications.MyAccount.getLayout()
   ,	menu_tree = MenuTreeView.getInstance();

   menu_tree.replaceMenuItem(
    function (menuitem)
    {
     return menuitem && menuitem.id === 'product_list_dummy';
    }
   ,	function (application)
    {
     var utils = application.ProductListModule.Utils;
     if (!utils.isProductListEnabled())
     {
      return undefined;
     }

     var product_lists = utils.getProductLists()
     ,	actual_object = {

      id: function ()
      {
       // Returns the correct id of the list in the case of single list and 'productlists' otherwise.
       var is_single_list = utils.isSingleList();

       if (is_single_list)
       {
        var the_single_list = product_lists.at(0);

        // Check if it's a predefined list before return
        return 'productlist_' + (the_single_list.get('internalid') ? the_single_list.get('internalid') : ('tmpl_' + the_single_list.get('templateId')));
       }
       else
       {
        return 'productlists';
       }
      }
     ,	name: function ()
      {
       // The name of the first list in the case of single list or generic 'Product Lists' otherwise
       return utils.isSingleList() ?
        product_lists.at(0).get('name') :
        _('Your Wishlist').translate();
      }
     ,	url: function ()
      {
       // Returns a link to the list in the case of single list and no link otherwise.
       var is_single_list = utils.isSingleList();
       if (is_single_list)
       {
        var the_single_list = product_lists.at(0);
        return 'wishlist/' + (the_single_list.get('internalid') ? the_single_list.get('internalid') : ('tmpl_' + the_single_list.get('templateId')));
       }
       else
       {
        return '';
       }
      }
      // Index of the menu item for menu order
     ,	index: 7
      // Sub-menu items
     ,	children: function ()
      {
       // If it's single list, there is no sub-menu
       if (utils.isSingleList())
       {
        return [];
       }
       // The first item (if not single list) has to be a link to the landing page
       var items = [
        {
         id: 'productlist_all'
        ,	name: _('All my lists').translate()
        ,	url: 'wishlist/?'
        ,	index: 1
        }
       ];
       // Then add all the lists
       product_lists.each(function (productlist)
       {
        items.push({
         id: 'productlist_' + (productlist.get('internalid') || 'tmpl_' + productlist.get('templateId'))
        ,	url: 'wishlist/' + (productlist.get('internalid') || 'tmpl_' + productlist.get('templateId'))
        ,	name: productlist.get('name') + ' (' + productlist.get('items').length + ')'
        ,	index: 2
        });
       });

       return items;
      }
     };
     return actual_object;
    }
   );

   menu_tree.updateMenuItemsUI();

   if (application.ProductListModule.Utils.isSingleList())
   {
    // Update header profile link for single product list...
    var the_single_list = application.ProductListModule.Utils.getProductLists().at(0)
    ,	product_list_menu_item = layout.$('.header-profile-single-productlist');

    if (the_single_list && product_list_menu_item)
    {
     var product_list_hashtag = '#wishlist/' + (the_single_list.get('internalid') ? the_single_list.get('internalid') : ('tmpl_' + the_single_list.get('templateId')));

     product_list_menu_item.text(the_single_list.get('name'));
     product_list_menu_item.attr('data-hashtag', product_list_hashtag);
    }
   }
  };*/
  
  /*ProductListUtils.profileModelPromiseDone = _.wrap(ProductListUtils.profileModelPromiseDone, function (originalProfileModelPromiseDone)
  {
   var results = originalProfileModelPromiseDone.apply(this, _.rest(arguments));
   
   console.log('ProductListUtils.profileModelPromiseDone override!');
   
   utils.getProductListsPromise().done(ProductListUtils.productListsPromiseDone);
  });*/
  
  ProductList.mountToApp = _.wrap(ProductList.mountToApp, function (originalMountToApp, application)
  {
   var results = originalMountToApp.apply(this, _.rest(arguments));
   
   console.log('ProductList.mountToApp override!');
   
   application.ProductListModule.Utils.productListsPromiseDone = function ()
   {
    console.log('ProductListUtils.productListsPromiseDone override!');
    // Replace dummy menu item from My Account
    var layout = application.getLayout()
    ,	menu_tree = MenuTreeView.getInstance();

    menu_tree.replaceMenuItem(
     function (menuitem)
     {
      console.log(' menu_tree.replaceMenuItem 1');
      return menuitem && menuitem.id === 'product_list_dummy_bb1';
     }
    ,	function (application)
     {
      var utils = application.ProductListModule.Utils;
      console.log(' menu_tree.replaceMenuItem');
      console.log(utils);
      if (!utils.isProductListEnabled())
      {
       return undefined;
      }

      var product_lists = utils.getProductLists()
      ,	actual_object = {

       id: function ()
       {
        // Returns the correct id of the list in the case of single list and 'productlists' otherwise.
        var is_single_list = utils.isSingleList();

        if (is_single_list)
        {
         var the_single_list = product_lists.at(0);

         // Check if it's a predefined list before return
         return 'productlist_' + (the_single_list.get('internalid') ? the_single_list.get('internalid') : ('tmpl_' + the_single_list.get('templateId')));
        }
        else
        {
         return 'productlists';
        }
       }
      ,	name: function ()
       {
        // The name of the first list in the case of single list or generic 'Product Lists' otherwise
        return utils.isSingleList() ?
         product_lists.at(0).get('name') :
         _('Your Wishlist').translate();
       }
      ,	url: function ()
       {
        // Returns a link to the list in the case of single list and no link otherwise.
        var is_single_list = utils.isSingleList();
        if (is_single_list)
        {
         var the_single_list = product_lists.at(0);
         return 'wishlist/' + (the_single_list.get('internalid') ? the_single_list.get('internalid') : ('tmpl_' + the_single_list.get('templateId')));
        }
        else
        {
         return '';
        }
       }
       // Index of the menu item for menu order
      ,	index: 7
       // Sub-menu items
      ,	children: function ()
       {
        // If it's single list, there is no sub-menu
        if (utils.isSingleList())
        {
         return [];
        }
        // The first item (if not single list) has to be a link to the landing page
        var items = [
         {
          id: 'productlist_all'
         ,	name: _('All my lists').translate()
         ,	url: 'wishlist/?'
         ,	index: 1
         }
        ];
        // Then add all the lists
        product_lists.each(function (productlist)
        {
         items.push({
          id: 'productlist_' + (productlist.get('internalid') || 'tmpl_' + productlist.get('templateId'))
         ,	url: 'wishlist/' + (productlist.get('internalid') || 'tmpl_' + productlist.get('templateId'))
         ,	name: productlist.get('name') + ' (' + productlist.get('items').length + ')'
         ,	index: 2
         });
        });

        return items;
       }
      };
      return actual_object;
     }
    );

    menu_tree.updateMenuItemsUI();

    if (application.ProductListModule.Utils.isSingleList())
    {
     // Update header profile link for single product list...
     var the_single_list = application.ProductListModule.Utils.getProductLists().at(0)
     ,	product_list_menu_item = layout.$('.header-profile-single-productlist');

     if (the_single_list && product_list_menu_item)
     {
      var product_list_hashtag = '#wishlist/' + (the_single_list.get('internalid') ? the_single_list.get('internalid') : ('tmpl_' + the_single_list.get('templateId')));

      product_list_menu_item.text(the_single_list.get('name'));
      product_list_menu_item.attr('data-hashtag', product_list_hashtag);
     }
    }
   };
   
   application.ProductListModule.Utils.profileModelPromiseDone = _.wrap(application.ProductListModule.Utils.profileModelPromiseDone, function (originalProfileModelPromiseDone)
   {
    var results = originalProfileModelPromiseDone.apply(this, _.rest(arguments));
    
    console.log('ProductListUtils.profileModelPromiseDone override!');
    var utils = application.ProductListModule.Utils;
    
    utils.getProductListsPromise().done(utils.productListsPromiseDone);
   });
   
   ProfileModel.getPromise().done(application.ProductListModule.Utils.profileModelPromiseDone);
  });
  
  /*TransactionLineModel.prototype.getVisibleOptions = ProductLineCommon.getVisibleOptions = _.wrap(ProductLineCommon.getVisibleOptions, function(originalGetVisibleOptions)
  {
   //console.log('ProductLineCommon.getVisibleOptions wrapped');
   //var results = originalGetVisibleOptions.apply(this, _.rest(arguments));
   var collection;
   //if(Configuration.get('ItemOptions.showOnlyTheListedOptions'))
   //{
    collection = this.get('options')
     .filter(function(option)
     {
      return _.find(Configuration.get('ItemOptions.optionsConfiguration'), function(optionConfiguration)
       {
        var cartOptionId = option.get('cartOptionId');
        return optionConfiguration.cartOptionId === cartOptionId && !(cartOptionId == 'custcol_bb1_cop_brand' || cartOptionId == 'custcol_bb1_cop_freeitem');
       });
     });
   //}
   //else
   //{
   // collection = this.get('options').models;
   //}

   return _.sortBy(collection, function(option){return option.get('index');});
   //return results;
  });*/
  
  _.extend(OrderHistoryListView.prototype, {
   
   title: _('Your Orders').translate(),
   
   page_header: _('Your Orders').translate(),
   
   getContext: _.wrap(OrderHistoryListView.prototype.getContext, function(originalGetContext)
   {
    console.log('OrderHistoryListView.prototype.getContext wrapped');
    var context = originalGetContext.apply(this, _.rest(arguments));
    
    //context.columns[0] = _('Order No.').translate();
    console.log('context.columns');
    console.log(context.columns);
    
    _.extend(context, {
     //pageHeader: _('Your Orders').translate(),
     //columns: context.columns
    });
    
    return context;
   })
   
  });
  
  _.extend(OrderHistoryDetailsView.prototype, {
   
   getContext: _.wrap(OrderHistoryDetailsView.prototype.getContext, function(originalGetContext)
   {
    console.log('OrderHistoryDetailsView.prototype.getContext wrapped');
    var context = originalGetContext.apply(this, _.rest(arguments)),
        transactionRecordOriginMapping = Configuration.get('transactionRecordOriginMapping');

    console.log(transactionRecordOriginMapping);
    console.log(this.model.get('status'));
    var status = this.model.get('status');
    var shipMethodId = this.model.get('shipmethod'); //41837
    //var shipMethodName = this.model.get('shipmethods').get(shipMethodId).name; //41837
     
    /*if (shipMethodId == 41837) {
     if (status.internalid == 'pendingFulfillment') {
      status.name = _('Your order is getting ready for Collection').translate();
      this.model.set('status', status);
     }
     if (status.internalid == 'pendingBilling' || status.internalid == 'billed') {
      var bigCCustomerMessage = this.model.get('custbody_bb1_bigc_message');
      var collected = /Collected/i.test(bigCCustomerMessage);
      
      status.name = collected ? _('Collected').translate() : _('Your order is ready to collect').translate();
      this.model.set('status', status);
     }
    }
    else {
     if (shipMethodId && this.model.get('shipmethods')._byId[shipMethodId])
      var shipMethodName = this.model.get('shipmethods')._byId[shipMethodId].getFormattedShipmethod();
     else if (shipMethodId && shipMethodId.name)
      var shipMethodName = shipMethodId.name;

     console.log(shipMethodName);
     if (status.internalid == 'pendingFulfillment') {
      status.name = _('In our warehouse getting ready for dispatch').translate();
      this.model.set('status', status);
     }
     if (status.internalid == 'pendingBilling' || status.internalid == 'billed') {
      status.name = _('Dispatched with $(0)').translate(shipMethodName);
      this.model.set('status', status);
     }
    }*/
    
    _.extend(context, {
     title: _.findWhere(transactionRecordOriginMapping, { origin: this.model.get('origin') }).detailedName
    });
    
    return context;
   }),
   
   getBreadcrumbPages: function ()
   {
    return [
     {
       text: _('Your Orders').translate()
      ,	href: '/purchases'
     }
    , 	{
       text: '#' + this.model.get('tranid')
      ,	href :'/purchases/view/' + this.model.get('recordtype') + '/' + this.model.get('id')
     }
    ];
   }
   
  });
  
  _.extend(OrderHistoryItemActionsView.prototype, {
   
   getContext: _.wrap(OrderHistoryItemActionsView.prototype.getContext, function(originalGetContext)
   {
    console.log('OrderHistoryItemActionsView.prototype.getContext wrapped');
    var context = originalGetContext.apply(this, _.rest(arguments));

    var options = this.model.get('options');
    console.log('options');
    console.log(options);
    var hasOrderScheduleOption = !!options.findWhere({cartOptionId: 'custcol_bb1_blbi_orderschedule'});
    var bottomlessBowlId = this.model.get('custcol_bb1_blbi_blbi');
    var item = this.model.get('item');
    var bottomlessBowlDiscount = Math.abs(item.get('custitem_bb1_bb_discountrate'));
    var itemId = item.get('internalid');
     
    _.extend(context, {
     showCreateBottomlessBowl: hasOrderScheduleOption && !bottomlessBowlId,
     showManageBottomlessBowl: !!bottomlessBowlId,
     bottomlessBowlId: bottomlessBowlId,
     bottomlessBowlDiscount: bottomlessBowlDiscount,
     itemId: itemId
    });
    
    return context;
   })
   
  });
  
 return {

  mountToApp: function (container)
  {
			var pageType = container.getComponent('PageType');

			pageType.registerPageType({
				'name': 'MyAccountOverview'
			,	'routes': []
			,	'view': OverviewHomeView
			,	'defaultTemplate': {
					'name': 'overview_home.tpl'
				,	'displayName': 'My Account Overview Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-myaccount-overview.png')
				}
			});
   
   var routes = ['', '?*params', 'overview', 'overview?*params', 'purchases', 'purchases?:options', 'open-purchases', 'open-purchases?:options'];
			if(Configuration.get('siteSettings.isSCISIntegrationEnabled', false))
			{
				routes.push('instore-purchases');
				routes.push('instore-purchases?:options');
			}
   
			pageType.registerPageType({
				'name': 'PurchaseHistory'
			,	'routes': routes
			,	'view': OrderHistoryListView
			,	'defaultTemplate': {
					'name': 'order_history_list.tpl'
				,	'displayName': 'Purchase history default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-list.png')
				}
   });
  }

 };
 
});
