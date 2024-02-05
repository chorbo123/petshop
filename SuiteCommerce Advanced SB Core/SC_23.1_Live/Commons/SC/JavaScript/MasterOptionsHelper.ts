/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name = "MasterOptionsHelper"/>

import { Configuration } from '../../Utilities/JavaScript/Configuration';
import * as _ from 'underscore';

interface MasterOption {
    fieldset?: string;
    include?: string;
    'facet.exclude'?: string;
    [key: string]: string | boolean;
}

type MasterOptionModifier = (modifiedMasterOption: MasterOption, nativeMasterOption: MasterOption) => MasterOption;

export class MasterOptionsHelper {
    private static masterOptionModifiersMap: Record<string, MasterOptionModifier[]> = {};

    public static getSearchAPIMasterOption(searchApiMasterOptionId: string): MasterOption {
        // The replace is done for backwards compatibility, some modules use searchApiMasterOptions.masterOption instead of masterOption
        return this.applyMasterOptionModifiers(searchApiMasterOptionId.replace(/^searchApiMasterOptions\./, ''));
    }

    private static applyMasterOptionModifiers(searchApiMasterOptionId: string): MasterOption {
        const originalMasterOption = Configuration.searchApiMasterOptions[searchApiMasterOptionId];
        let modifiedMasterOption = {...originalMasterOption};

        if (this.masterOptionModifiersMap[searchApiMasterOptionId]) {
            _.each(this.masterOptionModifiersMap[searchApiMasterOptionId], (modifier: MasterOptionModifier) => {
                try {
                   modifiedMasterOption = modifier(modifiedMasterOption, {...originalMasterOption});
                } catch (e) {
                   console.warn('Error applying search api master option modifier: ', modifier.toString());
                }
            });
        }
        return modifiedMasterOption;
    }

    public static subscribeMasterOptionModifier(searchApiMasterOptionId: string, modifier: MasterOptionModifier): void {
        const searchApiMasterOptions = Configuration.searchApiMasterOptions;
        if(!searchApiMasterOptions[searchApiMasterOptionId]) {
            throw new MasterOptionsHelperException('INVALID_MASTER_OPTION', 'Invalid Search API Master Option');
        }
        if (!this.masterOptionModifiersMap[searchApiMasterOptionId]) this.masterOptionModifiersMap[searchApiMasterOptionId] = [];
        this.masterOptionModifiersMap[searchApiMasterOptionId].push(modifier);
    }
}

function MasterOptionsHelperException (error, message) {
    this.error = error;
    this.message = message;
}