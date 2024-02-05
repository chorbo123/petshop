/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Location.Model", ["require", "exports", "Utils", "Backbone.CachedModel"], function (require, exports, Utils, BackboneCachedModel) {
    "use strict";
    var LocationModel = BackboneCachedModel.extend({
        // @property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl('services/Location.Service.ss'),
        parse: function parse(response) {
            var nextPickupCutOffDay = response.nextpickupcutofftime;
            if (nextPickupCutOffDay && nextPickupCutOffDay !== ' ') {
                var currentDate = new Date();
                var days = [
                    'sunday',
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday'
                ];
                if (currentDate.getDay() === nextPickupCutOffDay) {
                    response.nextpickupday = 'today';
                }
                else if (currentDate.getDay() + 1 === nextPickupCutOffDay) {
                    response.nextpickupday = 'tomorrow';
                }
                else {
                    response.nextpickupday = days[nextPickupCutOffDay];
                }
            }
            return response;
        },
        toString: function toString() {
            return this.get('internalid') || '';
        }
    });
    return LocationModel;
});

//# sourceMappingURL=Location.Model.js.map
