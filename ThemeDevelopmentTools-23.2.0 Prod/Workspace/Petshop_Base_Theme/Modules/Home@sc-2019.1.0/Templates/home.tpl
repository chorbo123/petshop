<div class="home">

    <div data-cms-area="home_cms_area_1" data-cms-area-filters="path"></div>

    <div data-cms-area="home_cms_area_2" data-cms-area-filters="path"></div>

    {{#if hasSlidingBanners}}
    <div class="home-slider-container">
        <div class="home-image-slider">
            <!--<div data-cms-area="home-banner-slider" data-cms-area-filters="page_type"></div>-->
            <ul data-slider class="home-image-slider-list">
                {{#each slidingBanners}}
                <li>
                    <div class="home-slide-main-image">
                        {{#if url}}<a href="{{url}}" data-touchpoint="{{dataTouchpoint}}" datahashtag="#{{url}}">{{/if}}
                            <picture>
                                {{#if mobileImageUrl}}
                                <source srcset="{{mobileImageUrl}}" media="(max-width: 767px)" />
                                {{/if}}
                                {{#if tabletImageUrl}}
                                <source srcset="{{tabletImageUrl}}" media="(min-width: 768px) and (max-width: 991px)" />
                                {{/if}}
                                {{#if desktopImageUrl}}
                                <img src="{{desktopImageUrl}}" alt="{{title}}" />
                                {{/if}}
                            </picture>
                            {{#if bannerHtml}}
                            <div class="home-slide-main-image-overlay">
                                {{bannerHtml}}
                            </div>
                            {{/if}}
                            {{#if url}}
                        </a>{{/if}}
                    </div>
                </li>
                {{/each}}
            </ul>
        </div>
    </div>
    {{/if}}

    <div class="home-container">

        <div data-view="ItemList.RecentlyPurchased"></div>
        <div data-view="ItemList.RecentlyViewed"></div>
        <!--<div class="home-merchandizing-zone" data-cms-area="home-merchandising-zone-top" data-cms-area-filters="page_type"></div>-->

        {{#unlessEquals imageHomeSize 'homeslider'}}
        <div data-view="Brands.BottomlessBowl"></div>

        <div data-view="Brands.TopRated"></div>
        {{/unlessEquals}}

        <div data-view="PetShop.BestSellers"></div>

        {{#unlessEquals imageHomeSize 'homeslider'}}
        <div class="home-customisable-banners-container">

            <div class="home-customisable-banners-banner" data-cms-area="home_cms_area_banners_1"
                data-cms-area-filters="path"></div>

            <div class="home-customisable-banners-banner" data-cms-area="home_cms_area_banners_2"
                data-cms-area-filters="path"></div>

            <div class="home-customisable-banners-banner" data-cms-area="home_cms_area_banners_3"
                data-cms-area-filters="path"></div>

            <div class="home-customisable-banners-banner" data-cms-area="home_cms_area_banners_4"
                data-cms-area-filters="path"></div>

        </div>
        {{/unlessEquals}}

    </div>

    <!-- CTA -->
    <div class="home-cta">
        <div class="cta-banner-box">
            <a href="{{banners.mainBanners.bottomlessBowlBanner.url}}">
                <img src="{{banners.mainBanners.bottomlessBowlBanner.imageUrl}}"
                    alt="{{banners.mainBanners.bottomlessBowlBanner.alt}}">
            </a>
        </div>
    </div>

    <!-- Categories -->
    <div class="home-categories">
        <h3>Categories</h3>
        <div class="categories-flex">
            <div class="categories-item-wrap">
                <a href="/Dog/Dry-Dog-Food" class="categories">Dry dog food</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Cat/Dry-Cat-Food" class="categories">Dry cat food</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Dog/Dog-Cans-Pouches" class="categories">Wet dog food</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Cat/Cat-Cans-Pouches" class="categories">Wet cat food</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Dog/Dog-Treats-Chews" class="categories">Dog treats</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Cat/Cat-Treats" class="categories">Cat treats</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Dog/Veterinary-Diet-Dogs" class="categories">Dog veterinary</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Cat/Veterinary-Diets-for-Cats" class="categories">Cat veterinary</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Dog/Dog-Grooming" class="categories">Dog grooming</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Cat/Cat-Grooming" class="categories">Cat grooming</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Dog/Dog-Medicines" class="categories">Dog medicines</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Cat/Cat-Medicines" class="categories">Cat medicines</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Dog/Dog-Toys" class="categories">Dog toys</a>
            </div>
            <div class="categories-item-wrap">
                <a href="/Cat/Cat-Toys" class="categories">Cat toys</a>
            </div>
        </div>
    </div>

    <!-- Shop by Pet -->
    <div class="home-shop-by-pet">
        <h3>Shop by pet</h3>
        <div class="sbp-flex">
            <div class="sbp-item-wrap">
                <a href="#" class="sbp-item">
                    <div class="sbp-img">
                        <img src="{{getThemeAssetsPathWithDefault imgDogURL 'img/dog.png'}}" alt="Dog">
                    </div>
                    <div class="sbp-description">
                        <span>Dog</span>
                    </div>
                </a>
            </div>
            <div class="sbp-item-wrap">
                <a href="#" class="sbp-item">
                    <div class="sbp-img">
                        <img src="{{getThemeAssetsPathWithDefault imgCatURL 'img/cat.png'}}" alt="Cat">
                    </div>
                    <div class="sbp-description">
                        <span>Cat</span>
                    </div>
                </a>
            </div>
            <div class="sbp-item-wrap">
                <a href="#" class="sbp-item">
                    <div class="sbp-img">
                        <img src="{{getThemeAssetsPathWithDefault imgSmallPetURL 'img/small-pet.png'}}" alt="Small Pet">
                    </div>
                    <div class="sbp-description">
                        <span>Small Pet</span>
                    </div>
                </a>
            </div>
            <div class="sbp-item-wrap">
                <a href="#" class="sbp-item">
                    <div class="sbp-img">
                        <img src="{{getThemeAssetsPathWithDefault imgBirdURL 'img/bird.png'}}" alt="Bird">
                    </div>
                    <div class="sbp-description">
                        <span>Bird</span>
                    </div>
                </a>
            </div>
        </div>
        <div class="new-in">
            <div class="cta-banner-box">
                <a href="{{banners.mainBanners.clearanceBanner.url}}">
                    <img src="{{banners.mainBanners.clearanceBanner.imageUrl}}"
                        alt="{{banners.mainBanners.clearanceBanner.alt}}">
                </a>
            </div>
            <div class="new-in-cta">

                {{#each banners.seasonalBanners}}
                <div class="nic-item-wrap">
                    <a href="{{this.url}}">
                        <img src="{{this.imageUrl}}" alt="{{this.alt}}">
                    </a>
                </div>
                {{/each}}
            </div>
        </div>
    </div>

    <!-- Shop own brand -->
    <div class="home-shop-own-brand">
        <h3>Shop own brand</h3>
        <div class="sob-flex">
            <div class="sob-item-wrap">
                <a href="#" class="sob-item naturals">
                    <img src="{{getThemeAssetsPathWithDefault imgNaturalsURL 'img/naturals.png'}}" alt="Naturals">
                </a>
            </div>
            <div class="sob-item-wrap">
                <a href="#" class="sob-item finest-range">
                    <img src="{{getThemeAssetsPathWithDefault imgFinestRangeURL 'img/finest-range.png'}}"
                        alt="Finest Range">
                </a>
            </div>
        </div>
        <div class="huntland-cta">
            <div class="cta-banner-box">
                <a href="{{banners.mainBanners.huntlandBanner.url}}">
                    <img src="{{banners.mainBanners.huntlandBanner.imageUrl}}"
                        alt="{{banners.mainBanners.huntlandBanner.alt}}">
                </a>
            </div>
        </div>
    </div>

    <div data-view="GoogleCustomerReviews.Slider"></div>

    <div class="home-cms-section-bottom" data-cms-area="home_cms_area_bottom" data-cms-area-filters="path"></div>

    <div data-view="Newsletter.Signup"></div>

</div>

{{!----
Use the following context variables when customizing this template:

imageHomeSize (String)
imageHomeSizeBottom (String)
carouselImages (Array)
bottomBannerImages (Array)

----}}