<div data-view="Global.BackToTop"></div>

<div class="footer-content-wrapper">
  <div class="footer-content">

    <div id="banner-footer" class="content-banner banner-footer" data-cms-area="global_banner_footer"
      data-cms-area-filters="global"></div>

    <div class="footer-content-nav">
      {{#if showFooterNavigationLinks}}
      <ul class="footer-content-nav-list">
        {{#each footerNavigationLinks}}
        {{#if columnBreak}}
      </ul>
      <ul class="footer-content-nav-list">
        {{/if}}
        <li{{#if classes}} class="{{classes}}" {{/if}}>
          {{#if href}}
          <a {{objectToAtrributes item}}>
            {{#if imageUrl}}
            <img src="{{imageUrl}}" alt="{{text}}" />
            {{else}}
            {{text}}
            {{/if}}
          </a>
          {{else}}
          {{text}}
          {{/if}}
          </li>
          {{/each}}
      </ul>
      {{/if}}
    </div>

    <div class="footer-content-bottom">
      <div class="footer-logo-eu">
        <div class="footer-logo">
          <img
            src="https://www.petshop.co.uk/SSP%20Applications/PetShopBowl%20Ltd/PetShopBowl%202015%20-%20Global/img/ps-logo.png"
            alt="Petshop.co.uk">
        </div>
        <div class="footer-euro-ship"><img
            src="https://www.petshop.co.uk/SSP%20Applications/PetShopBowl%20Ltd/PetShopBowl%202015%20-%20Global/img/site-footer-european-union.png"
            width="16px" height="11px">
        </div>
      </div>

      <div class="footer-copyright">
        <!--<p>
     All prices are in <span title="Pound">GBP</span>
     Copyright 2020 PetShopBowl - petshop.co.uk.
     <a data-touchpoint="home" href="/sitemap" data-hashtag="#sitemap"><span>Sitemap</span></a> |
     <a data-touchpoint="home" href="/terms-conditions" data-hashtag="#terms-conditions">Terms &amp; Conditions</a>
    </p>-->
        <p>&copy; PetShopBowl Ltd</p>
      </div>
    </div>

  </div>
</div>

<div class="container">

  <div class="footer-payment-methods-media row">
    <div class="col-sm-6 footer-banner-payment-methods-container">
      <img class="footer-banner-payment-methods"
        src="https://staging.petshop.co.uk/SSP Applications/PetShopBowl Ltd/PetShopBowl 2020 - SCA Staging/img/site-footer-payment-methods.png"
        alt="Payment Methods">
    </div>

    <div class="col-sm-6" style="text-align:right;">
      <img class="footer-banner-media"
        src="https://www.petshop.co.uk/SSP%20Applications/PetShopBowl%20Ltd/PetShopBowl%202015%20-%20Global/img/site-footer-media.gif"
        alt="As seen on: BBC News, London Evening Standard, SkyNews">

      <a href="http://www.reviewcentre.com/Online-Pet-Shops/PetShopBowl-www-petshopbowl-co-uk-reviews_1378458"
        target="_blank" class="footer-banner-reviews"
        onclick="_gaq.push(['_trackEvent', 'Footer', 'PressLinks',,, false]);">
        <img
          src="https://www.petshop.co.uk/SSP%20Applications/PetShopBowl%20Ltd/PetShopBowl%202015%20-%20Global/img/site-footer-reviews.gif"
          alt="Review Centre">
      </a>
    </div>
  </div>

</div>

<div id="cms-header-dropdown-container">

  <h1>Brands Drop-down</h1>

  <div class="header-menu-level-container banner">
    <h3>Brands Banner Index</h3>
    <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_brands_index"
      data-cms-area-filters="global"></div>
    <div class="header-menu-dropdown-banner-content-container">
      <div id="header-dropdown-content-brands" class="header-menu-dropdown-banner-content">
        <h3>Brands Banner Links</h3>
        <div id="header-dropdown-content-brands-list" data-cms-area="header_menu_dropdown_brands_links"
          data-cms-area-filters="global"></div>
        <h3>Brands Banner Content</h3>
        <div id="header-dropdown-content-brands-banner" data-cms-area="header_menu_dropdown_brands_content"
          data-cms-area-filters="global"></div>
      </div>
    </div>
  </div>

  <h1>Dogs Drop-down</h1>

  <div class="header-menu-level-container banner">
    <h3>Dogs Banner Links</h3>
    <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_dogs_links"
      data-cms-area-filters="global"></div>
    <h3>Dogs Banner Content</h3>
    <div class="header-menu-dropdown-banner-content-container">
      <div id="header-dropdown-content-dogs" class="header-menu-dropdown-banner-content"
        data-cms-area="header_menu_dropdown_dogs_content" data-cms-area-filters="global"></div>
    </div>
  </div>

  <h1>Cats Drop-down</h1>

  <div class="header-menu-level-container banner">
    <h3>Cats Banner Links</h3>
    <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_cats_links"
      data-cms-area-filters="global"></div>
    <h3>Cats Banner Content</h3>
    <div class="header-menu-dropdown-banner-content-container">
      <div id="header-dropdown-content-cats" class="header-menu-dropdown-banner-content"
        data-cms-area="header_menu_dropdown_cats_content" data-cms-area-filters="global"></div>
    </div>
  </div>

  <h1>Small Pets Drop-down</h1>

  <div class="header-menu-level-container banner">
    <h3>Small Pets Banner Links</h3>
    <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_smallpets_links"
      data-cms-area-filters="global"></div>
    <h3>Small Pets Banner Content</h3>
    <div class="header-menu-dropdown-banner-content-container">
      <div id="header-dropdown-content-small-pets" class="header-menu-dropdown-banner-content"
        data-cms-area="header_menu_dropdown_smallpets_content" data-cms-area-filters="global"></div>
    </div>
  </div>

  <h1>Birds Drop-down</h1>

  <div class="header-menu-level-container banner medium">
    <h3>Birds Banner Links</h3>
    <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_birds_links"
      data-cms-area-filters="global"></div>
    <h3>Birds Banner Content</h3>
    <div class="header-menu-dropdown-banner-content-container">
      <div id="header-dropdown-content-birds" class="header-menu-dropdown-banner-content"
        data-cms-area="header_menu_dropdown_birds_content" data-cms-area-filters="global"></div>
    </div>
  </div>

  <h1>Horse Drop-down</h1>

  <div class="header-menu-level-container banner small">
    <h3>Horse Banner Links</h3>
    <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_horse_links"
      data-cms-area-filters="global"></div>
    <h3>Horse Banner Content</h3>
    <div class="header-menu-dropdown-banner-content-container">
      <div id="header-dropdown-content-horse" class="header-menu-dropdown-banner-content"
        data-cms-area="header_menu_dropdown_horse_content" data-cms-area-filters="global"></div>
    </div>
  </div>

  <h1>Seasonal Drop-down</h1>

  <div class="header-menu-level-container banner small">
    <h3>Seasonal Banner Links</h3>
    <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_seasonal_links"
      data-cms-area-filters="global"></div>
    <h3>Seasonal Banner Content</h3>
    <div class="header-menu-dropdown-banner-content-container">
      <div id="header-dropdown-content-seasonal" class="header-menu-dropdown-banner-content"
        data-cms-area="header_menu_dropdown_seasonal_content" data-cms-area-filters="global"></div>
    </div>
  </div>

</div>

{{!----
Use the following context variables when customizing this template:

showFooterNavigationLinks (Boolean)
footerNavigationLinks (Array)

----}}