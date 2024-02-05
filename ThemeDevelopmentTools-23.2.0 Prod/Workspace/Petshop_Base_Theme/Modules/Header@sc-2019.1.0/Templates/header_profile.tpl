<ul class="nav">

 {{#if showExtendedMenu}}
  <li class="header-profile-mobile-link">
   <a href="#" data-touchpoint="customercenter" data-hashtag="#"><i></i></a>
  </li>
  <li class="header-profile-welcome">
   <a class="header-profile-welcome-link">
    <i class="header-profile-welcome-user-icon"></i>
    {{translate 'Hello $(0)' displayName}}
   </a>
  </li>
  <li class="header-profile-myaccount">
   <a class="header-profile-myaccount-link" href="#" data-toggle="dropdown" data-touchpoint="customercenter" data-navigation="ignore-click">
    <span class="header-profile-myaccount-title">{{translate 'Your Account'}}</span>
    <i class="header-profile-myaccount-carret-icon"></i>
   </a>
   {{#if showMyAccountMenu}}
    <ul class="header-profile-menu-myaccount-container">
     <li data-view="Header.Menu.MyAccount"></li>
    </ul>
   {{/if}}
  </li>

 {{else}}
  
  {{#if showLoginMenu}}
   {{#if showLogin}}
    <li class="header-profile-mobile-link">
     <a href="#" data-touchpoint="login" data-hashtag="login-register">
      <span>{{translate 'Sign In'}}</span><i></i>
     </a>
    </li>
    <li class="header-profile-myaccount">
     <a class="header-profile-myaccount-link" href="#" data-touchpoint="customercenter">
      <span class="header-profile-myaccount-title">{{translate 'Your Account'}}</span>
     </a>
    </li>
    <!--<div class="header-profile-menu-login-container">
     <ul class="header-profile-menu-login">
      <li>
       <a class="header-profile-login-link" data-touchpoint="login" data-hashtag="login-register" href="#">
        <i class="header-profile-login-icon"></i>
        {{translate 'Login'}}
       </a>
      </li>-->
      {{#if showRegister}}
       
       <!--<li> | </li>
       <li>
        <a class="header-profile-register-link" data-touchpoint="register" data-hashtag="login-register" href="#">
         {{translate 'Register'}}
        </a>
       </li>-->
      {{/if}}
     <!--</ul>
    </div>-->
   {{/if}}
  {{else}}
   <li>
    <a class="header-profile-loading-link">
     <i class="header-profile-loading-icon"></i>
     <span class="header-profile-loading-indicator"></span>
    </a>
   </li>
  {{/if}}

 {{/if}}

</ul>


{{!----
Use the following context variables when customizing this template:

	showExtendedMenu (Boolean)
	showLoginMenu (Boolean)
	showLoadingMenu (Boolean)
	showMyAccountMenu (Boolean)
	displayName (String)
	showLogin (Boolean)
	showRegister (Boolean)

----}}
