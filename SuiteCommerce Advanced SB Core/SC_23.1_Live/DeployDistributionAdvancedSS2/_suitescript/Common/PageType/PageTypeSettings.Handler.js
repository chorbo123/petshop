/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "N/record", "N/util", "N/search"], function (require, exports, record, util, search) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageTypeSettingsHandler = void 0;
    var PageTypeSettingsHandler = /** @class */ (function () {
        function PageTypeSettingsHandler() {
        }
        PageTypeSettingsHandler.prototype.get = function (id, params) {
            var columns = [];
            var columnsSearch = [];
            var rec = record.create({
                type: params.recname
            });
            util.each(rec.getFields(), function (key) {
                if (key.indexOf('custrecord') === 0) {
                    columns.push(key);
                    columnsSearch.push(key);
                }
            });
            var recSearch = search.create({
                type: params.recname,
                columns: columnsSearch,
                filters: ['internalid', 'is', id]
            });
            var result = {};
            recSearch.run().each(function (data) {
                util.each(columns, function (column) {
                    result[column] = data.getValue(column);
                });
                return true;
            });
            return result;
        };
        return PageTypeSettingsHandler;
    }());
    exports.PageTypeSettingsHandler = PageTypeSettingsHandler;
});
