/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Location.Model"/>
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';

import BackboneCachedModel = require('../../../Commons/BackboneExtras/JavaScript/Backbone.CachedModel');

const LocationModel: any = BackboneCachedModel.extend({
    // @property {String} urlRoot
    urlRoot: Utils.getAbsoluteUrl('services/Location.Service.ss'),

    parse: function parse(response) {
        const nextPickupCutOffDay = response.nextpickupcutofftime;

        if (nextPickupCutOffDay && nextPickupCutOffDay !== ' ') {
            const currentDate = new Date();
            const days = [
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
            } else if (currentDate.getDay() + 1 === nextPickupCutOffDay) {
                response.nextpickupday = 'tomorrow';
            } else {
                response.nextpickupday = days[nextPickupCutOffDay];
            }
        }

        return response;
    },

    toString: function toString() {
        return this.get('internalid') || '';
    }
});

export = LocationModel;
