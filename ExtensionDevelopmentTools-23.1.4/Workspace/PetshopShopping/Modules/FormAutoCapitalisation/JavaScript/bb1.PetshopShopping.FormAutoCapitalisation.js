define(
	'bb1.PetshopShopping.FormAutoCapitalisation',
	[
  'LoginRegister.Register.View',
		'Address.Edit.Fields.View',
  
  'underscore'
	],
	function(
  LoginRegisterRegisterView,
  AddressEditFieldsView,
  
  _
	)
 {
  'use strict';

  var capitaliseField = function (e)
  {
   var field = jQuery(e.target),
       tokens = field.val().split(/\s+/) || [];
       
   var capitalisedTokens = _.map(tokens, function(token) {
    return token.substr(0, 1).toUpperCase() + token.substr(1).toLowerCase();
   });
   
   field.val(capitalisedTokens.join(' '));
  };
  
  _.extend(LoginRegisterRegisterView.prototype, {
   
   capitaliseField: capitaliseField

  });
   
  _.extend(AddressEditFieldsView.prototype, {
   
   capitaliseField: capitaliseField,
   
   capitaliseWholeField: function (e)
   {
    var field = jQuery(e.target);
    field.val(field.val().toUpperCase());
   }

  });
   
  _.extend(LoginRegisterRegisterView.prototype.events, {
   
   'change input[name="firstname"]': 'capitaliseField',
   'change input[name="lastname"]': 'capitaliseField'
   
  });
  
  _.extend(AddressEditFieldsView.prototype.events, {
   
   'change input[name="fullname"]': 'capitaliseField',
   'change input[name="company"]': 'capitaliseField',
   'change input[name="addr1"]': 'capitaliseField',
   'change input[name="addr2"]': 'capitaliseField',
   'change input[name="city"]': 'capitaliseField',
   'change input[name="state"]': 'capitaliseField',
   'change input[name="zip"]': 'capitaliseWholeField'
   
  });
  
 }
);
