/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
define(["require", "exports", "./HttpResponse", "./RequestErrors", "../../third_parties/underscore.js"], function (require, exports, HttpResponse_1, RequestErrors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ServiceController = void 0;
    var ServiceController = /** @class */ (function () {
        function ServiceController(context) {
            this.response = context.response;
            this.request = context.request;
        }
        ServiceController.prototype.initialize = function () {
            try {
                this.handle();
            }
            catch (ex) {
                this.sendError(ex);
            }
        };
        ServiceController.prototype.getServiceAction = function () {
            var method = String(this.request.method).toLowerCase();
            return method === 'get' && (this.request.parameters && this.request.parameters.internalid)
                ? 'getById'
                : method;
        };
        ServiceController.prototype.checkOriginRequest = function () {
            return true;
        };
        ServiceController.prototype.handle = function () {
            var body = JSON.parse(this.request.body || '{}');
            var parameters = this.request.parameters || {};
            var serviceAction = this.getServiceAction();
            if (this.checkOriginRequest() &&
                (serviceAction === 'post' || serviceAction === 'put' || serviceAction === 'delete')) {
                var xRequestedWith = this.request.headers['X-Requested-With'] ||
                    this.request.headers['x-requested-with'];
                if (xRequestedWith !== 'XMLHttpRequest') {
                    throw RequestErrors_1.invalidOriginError;
                }
            }
            this.data = body; // TODO: remove (we need to remove it in subscriptions also)
            var result;
            switch (serviceAction) {
                case 'getById':
                    result = this.getById(parameters.internalid, parameters);
                    break;
                case 'get':
                    result = this.get(parameters);
                    break;
                case 'post':
                    result = this.post(body, parameters);
                    break;
                case 'put':
                    result = this.put(body, parameters);
                    break;
                case 'delete':
                    result = this.delete(body, parameters);
                    break;
                default:
                    throw RequestErrors_1.methodNotAllowedError;
            }
            this.sendContent(result);
        };
        ServiceController.prototype.sendContent = function (response) {
            // TODO: review window.suiteLogs & Application events
            this.response.setHeader({
                name: 'Custom-Header-Status',
                value: String(response.getCustomStatus())
            });
            this.response.setHeader({
                name: 'Content-Type',
                value: response.getContentType()
            });
            // Set the response cache option
            var cache = response.getCache();
            if (cache) {
                this.response.setCdnCacheable({ type: cache });
            }
            this.response.write({ output: response.getBodyString() });
        };
        ServiceController.prototype.sendError = function (error) {
            var status = error.status || RequestErrors_1.badRequestError.status;
            var errorBody = {
                errorStatusCode: String(status),
                errorCode: error.name || 'UNKNOWN_ERROR',
                errorMessage: _.escape(error.message) || 'error'
            };
            if (error.details) {
                errorBody.errorDetails = error.details;
            }
            if (error.params) {
                errorBody.errorMessageParams = error.params;
            }
            var response = new HttpResponse_1.HttpResponse(errorBody, { customStatus: status });
            this.sendContent(response);
        };
        ServiceController.prototype.get = function (parameters) {
            throw RequestErrors_1.forbiddenError;
        };
        ServiceController.prototype.getById = function (id, parameters) {
            throw RequestErrors_1.forbiddenError;
        };
        ServiceController.prototype.post = function (body, parameters) {
            throw RequestErrors_1.forbiddenError;
        };
        ServiceController.prototype.put = function (body, parameters) {
            throw RequestErrors_1.forbiddenError;
        };
        ServiceController.prototype.delete = function (body, parameters) {
            throw RequestErrors_1.forbiddenError;
        };
        return ServiceController;
    }());
    exports.ServiceController = ServiceController;
});
