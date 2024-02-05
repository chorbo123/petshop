<div class="product-details-image-gallery">
	{{#if showImages}}
		{{#if showImageSlider}}
			<ul class="bxslider" data-slider>
				{{#each images}}
					<li data-zoom class="product-details-image-gallery-container">
						<img
							src="{{resizeImage url ../imageResizeId}}"
							alt="{{altimagetext}}"
       {{#if @first}}itemprop="image"{{/if}}
							data-loader="false">
     {{#if ../isFreeDelivery}}
      <span class="product-details-image-gallery-free-delivery"></span>
     {{/if}}
     {{#if ../isSale}}
      <span class="product-details-image-gallery-sale"></span>
     {{/if}}
     {{#if ../productTypeImageUrl}}
      <span class="product-details-image-gallery-product-type" style="background-image: url({{../productTypeImageUrl}});"></span>
     {{/if}}
     {{#if ../expressDelivery.nextDayAvailable}}
      <span class="product-details-image-gallery-next-day-delivery"></span>
     {{/if}}
					</li>
				{{/each}}
			</ul>
		{{else}}
			{{#with firstImage}}
				<div class="product-details-image-gallery-detailed-image" data-zoom>
					<img
						class="center-block"
						src="{{resizeImage url ../imageResizeId}}"
						alt="{{altimagetext}}"
      itemprop="image"
						data-loader="false">
     {{#if isFreeDelivery}}
      <span class="icon-free-delivery"></span>
     {{/if}}
     {{#if isSale}}
      <span class="icon-sale"></span>
     {{/if}}
     {{#if productTypeImageUrl}}
      <span class="icon-product-type" style="background-image: url({{../productTypeImageUrl}});"></span>
     {{/if}}
     {{#if ../expressDelivery.nextDayAvailable}}
      <span class="product-details-image-gallery-next-day-delivery"></span>
     {{/if}}
				</div>
			{{/with}}

		{{/if}}
	{{/if}}
	<div data-view="SocialSharing.Flyout.Hover"></div>
</div>




{{!----
Use the following context variables when customizing this template:

	imageResizeId (String)
	images (Array)
	firstImage (Object)
	firstImage.altimagetext (String)
	firstImage.url (String)
	showImages (Boolean)
	showImageSlider (Boolean)

----}}
