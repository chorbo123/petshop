/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import { ServiceController, ServiceContext } from '../../../Common/Controller/ServiceController';
import { Configuration } from '../Configuration/Configuration';
import Auth from '../Auth/Auth';

import {
    unauthorizedError,
    forbiddenError,
    missingWebsiteIdParameter
} from '../../../Common/Controller/RequestErrors';
import { SCEnvironment } from '../Environment/SCEnvironment';
import { Website } from '../../../Common/Website/Website';
import * as log from 'N/log';

export abstract class SCAServiceController extends ServiceController {
    public constructor(context: ServiceContext) {
        super(context);

        try {
            // set the current website (this can be removed after we can get website id from backend
            // instead of an url parameter)
            const currentWebsite: Website = new Website(Number(this.request.parameters.n));
            const runtime = SCEnvironment.getInstance();
            runtime.setCurrentUrl(this.request.url);
            runtime.setCurrentWebsite(currentWebsite);
        } catch (ex) {
            log.debug('Error setting the environment', ex);
        }

        const siteId = Number(this.request.parameters.n);
        const domain: string =
            this.request.parameters.domain || SCEnvironment.getInstance().getHost();

        Configuration.getInstance().setSiteAndDomain(siteId, domain, this.request.url);
    }

    protected handle(): void {
        if (!SCEnvironment.getInstance().getCurrentWebsite()) {
            throw missingWebsiteIdParameter;
        }

        const serviceAction: string = this.getServiceAction();
        if (!Auth.validateLogin(serviceAction)) {
            return this.sendError(unauthorizedError);
        }
        if (!Auth.validatePermissions(serviceAction)) {
            return this.sendError(forbiddenError);
        }
        return super.handle();
    }
}