/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import * as record from 'N/record';
import * as util from 'N/util';
import * as search from 'N/search';

export interface PageTypeSettingsHandlerParams {
    recname: string;
}

export class PageTypeSettingsHandler {
    public get(id: string, params: PageTypeSettingsHandlerParams) {
        const columns = [];
        const columnsSearch = [];

        const rec = record.create({
            type: params.recname
        });

        util.each(rec.getFields(), function(key) {
            if (key.indexOf('custrecord') === 0) {
                columns.push(key);
                columnsSearch.push(key);
            }
        });

        const recSearch = search.create({
            type: params.recname,
            columns: columnsSearch,
            filters: ['internalid', 'is', id]
        });

        const result = {};

        recSearch.run().each(function(data) {
            util.each(columns, function(column) {
                result[column] = data.getValue(column);
            });

            return true;
        });

        return result;
    }
}