/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Notifications.View"/>
// @module Notifications
import * as notifications_tpl from 'notifications.tpl';

import NotificationsOrderView = require('./Notifications.Order.View');
import NotificationsProfileView = require('./Notifications.Profile.View');
import BackboneView = require('../../../Commons/BackboneExtras/JavaScript/Backbone.View');

// @class Notifications.View @extends Backbone.View
const NotificationsView: any = BackboneView.extend({
    template: notifications_tpl,
    checkProfileNotificationMessage: false,

    initialize: function(firstTimeRenderView = { firstTime: false }) {
        this.firstTimeProfile = firstTimeRenderView.firstTime;
        this.firstTimeOrder = firstTimeRenderView.firstTime;
    },

    // @property {ChildViews} childViews
    childViews: {
        'Order.Notifications': function() {
            if (this.firstTimeOrder) {
                this.firstTimeOrder = false;
                return null;
            }
            return new NotificationsOrderView();
        },
        'Profile.Notifications': function() {
            if (this.firstTimeProfile) {
                this.firstTimeProfile = false;
                return null;
            }
            return new NotificationsProfileView();
        }
    },

    // @method getContext @return Notifications.View.Context
    getContext: function() {
        // @class Notifications.View.Context
        return {};
    }
});

export = NotificationsView;
