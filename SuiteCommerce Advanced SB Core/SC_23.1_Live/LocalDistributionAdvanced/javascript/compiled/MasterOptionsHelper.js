/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("MasterOptionsHelper", ["require", "exports", "Configuration", "underscore"], function (require, exports, Configuration_1, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MasterOptionsHelper = void 0;
    var MasterOptionsHelper = /** @class */ (function () {
        function MasterOptionsHelper() {
        }
        MasterOptionsHelper.getSearchAPIMasterOption = function (searchApiMasterOptionId) {
            // The replace is done for backwards compatibility, some modules use searchApiMasterOptions.masterOption instead of masterOption
            return this.applyMasterOptionModifiers(searchApiMasterOptionId.replace(/^searchApiMasterOptions\./, ''));
        };
        MasterOptionsHelper.applyMasterOptionModifiers = function (searchApiMasterOptionId) {
            var originalMasterOption = Configuration_1.Configuration.searchApiMasterOptions[searchApiMasterOptionId];
            var modifiedMasterOption = __assign({}, originalMasterOption);
            if (this.masterOptionModifiersMap[searchApiMasterOptionId]) {
                _.each(this.masterOptionModifiersMap[searchApiMasterOptionId], function (modifier) {
                    try {
                        modifiedMasterOption = modifier(modifiedMasterOption, __assign({}, originalMasterOption));
                    }
                    catch (e) {
                        console.warn('Error applying search api master option modifier: ', modifier.toString());
                    }
                });
            }
            return modifiedMasterOption;
        };
        MasterOptionsHelper.subscribeMasterOptionModifier = function (searchApiMasterOptionId, modifier) {
            var searchApiMasterOptions = Configuration_1.Configuration.searchApiMasterOptions;
            if (!searchApiMasterOptions[searchApiMasterOptionId]) {
                throw new MasterOptionsHelperException('INVALID_MASTER_OPTION', 'Invalid Search API Master Option');
            }
            if (!this.masterOptionModifiersMap[searchApiMasterOptionId])
                this.masterOptionModifiersMap[searchApiMasterOptionId] = [];
            this.masterOptionModifiersMap[searchApiMasterOptionId].push(modifier);
        };
        MasterOptionsHelper.masterOptionModifiersMap = {};
        return MasterOptionsHelper;
    }());
    exports.MasterOptionsHelper = MasterOptionsHelper;
    function MasterOptionsHelperException(error, message) {
        this.error = error;
        this.message = message;
    }
});

//# sourceMappingURL=MasterOptionsHelper.js.map
