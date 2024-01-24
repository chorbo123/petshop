//@module bb1.PetshopShopping.PcaCapturePlus
// ----------
define(
	'bb1.PetshopShopping.PcaCapturePlus',
	[
  'Address.Model',
  'Application',
  'Configuration',
		'Utils',
		'SC.Model',
		'Models.Init',

		'underscore'
	]
,	function (
  AddressModel,
		Application,
  Configuration,
		Utils,
		SCModel,
  ModelsInit,

 	_
	)
{
	'use strict';

	AddressModel.validation.state = {required: false};
	AddressModel.validation.phone = {required: false};
	
});
