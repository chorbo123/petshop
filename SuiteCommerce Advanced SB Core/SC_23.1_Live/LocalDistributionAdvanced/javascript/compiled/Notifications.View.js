/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Notifications.View", ["require", "exports", "notifications.tpl", "Notifications.Order.View", "Notifications.Profile.View", "Backbone.View"], function (require, exports, notifications_tpl, NotificationsOrderView, NotificationsProfileView, BackboneView) {
    "use strict";
    // @class Notifications.View @extends Backbone.View
    var NotificationsView = BackboneView.extend({
        template: notifications_tpl,
        checkProfileNotificationMessage: false,
        initialize: function (firstTimeRenderView) {
            if (firstTimeRenderView === void 0) { firstTimeRenderView = { firstTime: false }; }
            this.firstTimeProfile = firstTimeRenderView.firstTime;
            this.firstTimeOrder = firstTimeRenderView.firstTime;
        },
        // @property {ChildViews} childViews
        childViews: {
            'Order.Notifications': function () {
                if (this.firstTimeOrder) {
                    this.firstTimeOrder = false;
                    return null;
                }
                return new NotificationsOrderView();
            },
            'Profile.Notifications': function () {
                if (this.firstTimeProfile) {
                    this.firstTimeProfile = false;
                    return null;
                }
                return new NotificationsProfileView();
            }
        },
        // @method getContext @return Notifications.View.Context
        getContext: function () {
            // @class Notifications.View.Context
            return {};
        }
    });
    return NotificationsView;
});

//# sourceMappingURL=Notifications.View.js.map
