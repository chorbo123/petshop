<div class="product-details-quickview">

	<article class="product-details-full-content" itemscope itemtype="https://schema.org/Product">
 
 <section class="product-details-full-main-content">
			<div class="product-details-full-content-header">

				<div data-cms-area="product_details_full_cms_area_1" data-cms-area-filters="page_type"></div>

				<h1 class="product-details-full-content-header-title" itemprop="name">
     {{pageHeader}}
     {{#if model.item.custitem_bb1_pet_brand}}
      <a class="product-details-full-content-header-brand" href="/Brand/{{brandFacetUrl}}">
       {{translate 'By $(0)' model.item.custitem_bb1_pet_brand}}
      </a>
     {{/if}}
    </h1>
    
				<div class="product-details-full-rating" data-view="Global.StarRating"></div>
  
    <div data-view="Product.Promotions"></div>
    
    <div data-cms-area="item_info" data-cms-area-filters="path"></div>
			</div>
			<div class="product-details-full-main-content-left">
				<div class="product-details-full-image-gallery-container">
					<div id="banner-image-top" class="content-banner banner-image-top"></div>
					<div data-view="Product.ImageGallery"></div>
					<div id="banner-image-bottom" class="content-banner banner-image-bottom"></div>

     <div class="product-details-full-extra-details">
      
      <p class="row-fluid sku">
       <span class="label">{{translate 'SKU:'}} </span>
       <span itemprop="sku" class="value">{{model.item._sku}}</span>
       <!--<div data-view="Product.Sku"></div>-->
      </p>
      
      {{#if model.item.weight}}
       <p class="row-fluid weight">
        <span class="label">{{translate 'Weight:'}} </span>
        <span itemprop="weight" class="value">{{model.item.weight}}{{model.item.weightunit}}</span>
       </p>
      {{/if}}
        
     </div>

					<div data-cms-area="product_details_full_cms_area_2" data-cms-area-filters="path"></div>
					<div data-cms-area="product_details_full_cms_area_3" data-cms-area-filters="page_type"></div>
				</div>
			</div>

			<div class="product-details-full-main-content-right">
			<div class="product-details-full-divider"></div>

			<div class="product-details-full-main">
				{{#if isItemProperlyConfigured}}
					<form id="product-details-full-form" data-action="submit-form" method="POST">

						<section class="product-details-full-info">
							<div id="banner-summary-bottom" class="product-details-full-banner-summary-bottom"></div>
						</section>

						<section data-view="Product.Options"></section>

						<div data-cms-area="product_details_full_cms_area_4" data-cms-area-filters="path"></div>

						<div data-view="Product.Price"></div>

						{{#if isPriceEnabled}}
      
       <div data-type="alert-placeholder"></div>
       
							<div data-view="BottomlessBowl.AddToCart"></div>
							
       <div class="add-to-cart-form">
        <div data-view="Quantity"></div>

        <section class="product-details-full-actions">
           
         <div data-view="Product.Stock.Info" class="product-details-stock-status{{#unless isInStock}} out-of-stock{{/unless}}"></div>

         <div class="product-details-full-actions-container">
          <div data-view="MainActionView"></div>
         </div>
         <!--<div class="product-details-full-actions-container">
          <div data-view="AddToProductList" class="product-details-full-actions-addtowishlist"></div>

          <div data-view="ProductDetails.AddToQuote" class="product-details-full-actions-addtoquote"></div>
         </div>-->

        </section>
       </div>
						{{/if}}
   
      <div data-view="Product.EstimatedDelivery"></div>
      
						<div data-view="StockDescription"></div>

						<!--<div data-view="SocialSharing.Flyout" class="product-details-full-social-sharing"></div>-->

						<div class="product-details-full-main-bottom-banner">
							<div id="banner-summary-bottom" class="product-details-full-banner-summary-bottom"></div>
						</div>
					</form>
				{{else}}
					<div data-view="GlobalViewsMessageView.WronglyConfigureItem"></div>
				{{/if}}

				<div id="banner-details-bottom" class="product-details-full-banner-details-bottom" data-cms-area="item_info_bottom" data-cms-area-filters="page_type"></div>
			</div>
			</div>

		</section>
		</article>
		</div>