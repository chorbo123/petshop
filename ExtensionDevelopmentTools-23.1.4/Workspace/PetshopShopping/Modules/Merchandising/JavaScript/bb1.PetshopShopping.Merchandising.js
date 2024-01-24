// @module bb1.PetshopShopping.Merchandising
define(
 'bb1.PetshopShopping.Merchandising',
 [
  'Merchandising.Zone',
  'Merchandising.View',
  'Merchandising.Item.Collection',
  'Facets.ItemCell.View',
  'Profile.Model',
  'Session',
  'SC.Configuration',
  
  'facets_item_cell_grid.tpl',
  'facets_items_collection_view_cell.tpl',
  'facets_items_collection_view_row.tpl',
  'facets_items_collection.tpl',
  'merchandising_zone_cell_template.tpl',
		'merchandising_zone_row_template.tpl',
  
  'Backbone.CollectionView'
 ],
 function (
  MerchandisingZone,
  MerchandisingView,
  MerchandisingItemCollection,
  FacetsItemCellView,
  ProfileModel,
  Session,
  Configuration,
  
  facets_item_cell_grid_tpl,
  facets_items_collection_view_cell_tpl,
  facets_items_collection_view_row_tpl,
  facets_items_collection_tpl,
  merchandising_zone_cell_template_tpl,
  merchandising_zone_row_template_tpl,
  
  BackboneCollectionView
 )
 {
  'use strict';
  
  MerchandisingItemCollection.prototype.searchApiMasterOptions = {};
  
  MerchandisingItemCollection.prototype.url = _.wrap(MerchandisingItemCollection.prototype.url, function(originalUrl) {
   
   var results = originalUrl.apply(this, _.rest(arguments));
   
   //console.log('MerchandisingItemCollection.prototype.url');
   //console.log(results);
   //console.log(Session.getSearchApiParams());
   //console.log(this.searchApiMasterOptions); 
   
   var profile = ProfileModel.getInstance();
   //console.log(profile.getSearchApiUrl());
			return _.addParamsToUrl(
				profile.getSearchApiUrl()
			,	_.extend(
					{}
				//,	this.searchApiMasterOptions
				,	Session.getSearchApiParams()
				)
			,	profile.isAvoidingDoubleRedirect()
			);
   
   return results;
   
  });
   
  _.extend(MerchandisingView.prototype.childViews, {
   
			'Zone.Items': function()
			{
				var itemsCollectionView = new BackboneCollectionView({
     childTemplate: facets_item_cell_grid_tpl,
					childView: FacetsItemCellView,
					viewsPerRow: 5, //Infinity,
					cellTemplate: facets_items_collection_view_cell_tpl, //merchandising_zone_cell_template_tpl,
					rowTemplate: facets_items_collection_view_row_tpl, //merchandising_zone_row_template_tpl,
     template: facets_items_collection_tpl,
					collection: _.first(this.items.models, this.model.get('show'))
				});

				return itemsCollectionView;
			}
   
		});
  
  MerchandisingZone.prototype.getApiParams = _.wrap(MerchandisingZone.prototype.getApiParams, function(originalGetApiParams) {
   
   var results = originalGetApiParams.apply(this, _.rest(arguments));
   
   //console.log('MerchandisingZone.prototype.getApiParams');
   //console.log(results);
   //console.log(this.model.get('fieldset'));
   
   //delete results.fieldset;// this.model.get('fieldset')
   
   return results;
   
  });
   
  MerchandisingZone.prototype.appendItems = _.wrap(MerchandisingZone.prototype.appendItems, function(originalAppendItems) {
   
   //console.log('MerchandisingZone.prototype.appendItems');
   
   //console.log(this);
   
   var items = this.items;
   
   this.model.set('template', '');
   /*if (items.length)
			{
    console.log('MerchandisingZone.prototype.appendItems 1');
    console.log(this.model.get('template'));
				if (this.model.get('template'))
				{
					// we try to get the 'template' from the merchandising rule
					var amd_optimize_trick_for_require = require;
					MerchandisingView.prototype.template = amd_optimize_trik_for_require(this.model.get('template'));
     console.log('MerchandisingZone.prototype.appendItems 1.5');
				}
    
    console.log('MerchandisingZone.prototype.appendItems 2');

				var view = new MerchandisingView({
						model: this.model
					,	items: items
					,	application: this.application
					});
     
    console.log('MerchandisingZone.prototype.appendItems 3');
    
				view.render();
console.log('MerchandisingZone.prototype.appendItems 4');
				this.$element.append(view.$el);
console.log('MerchandisingZone.prototype.appendItems 5');
				view.trigger('afterMerchandAppendToDOM');
    console.log('MerchandisingZone.prototype.appendItems 6');
			}

			items.trigger('appended');

			// notify the layout that the content might have changed
			this.options && this.options.application && this.options.application.getLayout().trigger('afterRender');
*/
   var results = originalAppendItems.apply(this, _.rest(arguments));
   
   //console.log(this);
   
   return results;
   
  });
  
 }
);
