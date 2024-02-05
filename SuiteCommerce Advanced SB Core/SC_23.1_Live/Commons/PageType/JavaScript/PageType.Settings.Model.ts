/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PageType.Settings.Model"/>
// @Typescript-partial

import { Model } from '../../../Commons/Core/JavaScript/Model';
import { PageTypeSettings } from '../../../ServiceContract/Common/PageType/PageType';

import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';

import BackboneCachedModel = require('../../BackboneExtras/JavaScript/Backbone.CachedModel');

interface PageTypeSettingsOptions {
    internalId: string;
    recName: string;
}

export class PageTypeSettingsModel extends Model<PageTypeSettings, PageTypeSettings> {
    // TODO: Once this extends of CachedModel the access to the prototype fetch won't be needed
    private readonly originalFetch = BackboneCachedModel.prototype.fetch;

    private readonly internalId: string = '';
    private readonly recName: string = '';

    protected urlRoot = (): string =>
        Utils.addParamsToUrl(Utils.getAbsoluteUrl('services/PageTypeSettings.ss', true), {
            internalid: this.internalId,
            recname: this.recName
        });

    public constructor(attributes: PageTypeSettingsOptions) {
        super();

        this.internalId = attributes.internalId;
        this.recName = attributes.recName;
    }

    // Overrides fetch so we make sure that the cache is set to true, so we wrap it
    public fetch() {
        return this.originalFetch.apply(this, arguments);
    }
}
