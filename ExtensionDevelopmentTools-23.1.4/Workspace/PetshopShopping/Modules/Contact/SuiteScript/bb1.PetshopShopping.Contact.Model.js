// @module bb1.PetshopShopping.Contact
define(
	'bb1.PetshopShopping.Contact.Model',
	[
		'SC.Model',
		'Application',
		'Utils',
		'underscore'
	],
	function (
		SCModel,
		Application,
		Utils,
		_
	)
 {
  'use strict';

  function validateEmail(value, name, form)
  {
   if (!value)
   {
    return 'Email Address is required';
   }
  }

  function validateLength(value, name)
  {
   var max_length = 4000;

   if (value && value.length > max_length)
   {
    return name + ' must be at most ' + max_length + ' characters';
   }
  }

  function validateMessage(value, name)
  {
   if (!value)
   {
    return 'Message is required';
   }

   return validateLength(value, name);
  }

  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.Contact',
   
   validation: {
    fullname: {
     required: true,
     msg: 'Full Name is required'
    },
    email: validateEmail,
    message: validateMessage
   },

   create: function (data)
   {
    this.validate(data);

    var author = 80525,
        recipient = "bark@petshopbowl.co.uk",
        subject = "New message from web contact form",
        bcc = null,
        replyTo = data.email,
        message = '<p>New message sent from <b>' + data.fullname + '</b> at email adress <b>' + data.email + '</b></p><blockquote>' + this.encodeHtmlFromMessage(data.message) + '</blockquote>';
        
    nlapiSendEmail(author, recipient, subject, message, null, bcc, null, null, null, null, replyTo);
    
    return {success:true};
   },
   
   stripHtmlFromMessage: function (message)
   {
    return message.replace(/<br\s*[\/]?>/gi, '\n').replace(/<(?:.|\n)*?>/gm, '');
   },
   
   encodeHtmlFromMessage: function (message)
   {
    return message.replace(/\r\n|\n|\r/gi, '<br>');
   }

  });

 }
);
