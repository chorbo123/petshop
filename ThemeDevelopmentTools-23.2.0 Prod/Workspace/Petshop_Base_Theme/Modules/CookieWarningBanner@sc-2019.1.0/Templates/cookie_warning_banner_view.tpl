{{#if showBanner}}
	<div class="cookie-warning-banner-view alert" role="alert">
		<div>
			{{{cookieMessage}}}
			{{#if showLink}}
			 <a href="{{linkHref}}" data-toggle="show-in-modal" data-page-header="{{linkContent}}">{{linkContent}}</a>
			{{/if}}
		</div>
		{{#if closable}}
			<div class="flex-break"></div>
			<button class="cookie-warning-banner-view-button" data-action="close-message" type="button" data-dismiss="alert">{{translate 'I Accept'}}</button> 
			<button class="cookie-warning-banner-view-button" data-action="close-message" type="button" data-dismiss="alert">{{translate 'Close'}}</button>
		{{/if}}
	</div>
{{/if}}




{{!----
Use the following context variables when customizing this template: 
	
	showBanner (Boolean)
	cookieMessage (String)
	showLink (Boolean)
	linkHref (String)
	linkContent (String)
	closable (Boolean)

----}}
