<div class="header-message" data-view="Message.Placeholder"></div>

<div class="header-main-wrapper header-2019">
 {{#if showLanguagesOrCurrencies}}
	<div class="header-subheader">
		<div class="header-subheader-container">
		<ul class="header-subheader-options">
			<li class="header-subheader-settings">
				<a href="#" class="header-subheader-settings-link" data-toggle="dropdown" title="{{translate 'Settings'}}">
					<i class="header-menu-settings-icon"></i>
					<i class="header-menu-settings-carret"></i>
				</a>
				<div class="header-menu-settings-dropdown">
					<h5 class="header-menu-settings-dropdown-title">{{translate 'Site Settings'}}</h5>
					{{#if showLanguages}}
						<div data-view="Global.HostSelector"></div>
					{{/if}}
					{{#if showCurrencies}}
						<div data-view="Global.CurrencySelector"></div>
					{{/if}}
				</div>
			</li>
			<li data-view="StoreLocatorHeaderLink"></li>
			<li data-view="RequestQuoteWizardHeaderLink"></li>
			<li data-view="QuickOrderHeaderLink"></li>
		</ul>
		</div>
	</div>
	{{/if}}
	<nav class="header-main-nav">

		<div id="banner-header-top" class="content-banner banner-header-top" data-cms-area="header_banner_top" data-cms-area-filters="global"></div>

		<div class="header-sidebar-toggle-wrapper">
			<button class="header-sidebar-toggle" data-action="header-sidebar-show">
				<i class="header-sidebar-toggle-icon"></i>
			</button>
		</div>

		<div class="header-content">
			<div class="header-logo-wrapper">
				<div class="header-2019-logo" data-view="Header.Logo"></div>
			</div>


			<div class="header-right-menu">
   
    <div class="header-2019-help">
     <span><strong>{{translate 'Here to help!'}}</strong></span>
     <span>{{translate '01789 205 095'}} &nbsp;|&nbsp; <a href="mailto:bark@petshop.co.uk">bark@petshop.co.uk</a></span>
    </div>
  
    <div class="header-menu-cart">
     <div class="header-menu-cart-dropdown" >
						<div data-view="Header.MiniCart"></div>
					</div>
    </div>
  
    <div class="header-menu-profile" data-view="Header.Profile"></div>
   
    <div class="header-site-search" data-view="SiteSearch"></div>
    
				<!--<div class="header-menu-locator-mobile" data-view="StoreLocatorHeaderLink"></div>
				<div class="header-menu-searchmobile" data-view="SiteSearch.Button"></div>-->
					
    <div class="header-menu-nav" data-view="Header.Menu" data-phone-template="header_sidebar" data-tablet-template="header_sidebar"></div>
     
			</div>
		</div>
  
     <!--<div class="header-menu-nav navbar hidden-phone main-nav site-header-main-nav" data-view="Header.Menu" data-phone-template="header_sidebar" data-tablet-template="header_sidebar">
      <div class="navbar-inner">
       <ul class="nav">
       </ul>
      </div>
     </div>
     
    </div>-->

	</nav>
</div>

<div class="header-sidebar-overlay" data-action="header-sidebar-hide"></div>

<div class="header-secondary-wrapper" data-view="Header.Menu" data-phone-template="header_sidebar" data-tablet-template="header_sidebar"></div>
 
{{#if showBanners}}
<div class="header-2019-bottom-banners-wrapper">
 <div class="container">
  <div class="header-2019-bottom-banners">

   {{#each banners}}
   <div class="header-2019-bottom-banner">
    <a href="{{bannerUrl}}" data-touchpoint="{{bannerTouchpoint}}" data-hashtag="{{bannerHashTag}}">
     {{{bannerHtml}}}
    </a>
   </div>
   {{/each}}

  </div>
 </div>
</div>
{{/if}}

<div id="banner-header-bottom" class="content-banner banner-header-bottom" data-cms-area="header_banner_bottom" data-cms-area-filters="global"></div>


{{!----
Use the following context variables when customizing this template: 
	
	profileModel (Object)
	profileModel.addresses (Array)
	profileModel.addresses.0 (Array)
	profileModel.creditcards (Array)
	profileModel.firstname (String)
	profileModel.paymentterms (undefined)
	profileModel.phoneinfo (undefined)
	profileModel.middlename (String)
	profileModel.vatregistration (undefined)
	profileModel.creditholdoverride (undefined)
	profileModel.lastname (String)
	profileModel.internalid (String)
	profileModel.addressbook (undefined)
	profileModel.campaignsubscriptions (Array)
	profileModel.isperson (undefined)
	profileModel.balance (undefined)
	profileModel.companyname (undefined)
	profileModel.name (undefined)
	profileModel.emailsubscribe (String)
	profileModel.creditlimit (undefined)
	profileModel.email (String)
	profileModel.isLoggedIn (String)
	profileModel.isRecognized (String)
	profileModel.isGuest (String)
	profileModel.priceLevel (String)
	profileModel.subsidiary (String)
	profileModel.language (String)
	profileModel.currency (Object)
	profileModel.currency.internalid (String)
	profileModel.currency.symbol (String)
	profileModel.currency.currencyname (String)
	profileModel.currency.code (String)
	profileModel.currency.precision (Number)
	showLanguages (Boolean)
	showCurrencies (Boolean)
	showLanguagesOrCurrencies (Boolean)
	showLanguagesAndCurrencies (Boolean)
	isHomeTouchpoint (Boolean)
	cartTouchPoint (String)

----}}
