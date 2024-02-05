/**

    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../../../Common/Environment/Environment"], function (require, exports, Environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SCEnvironment = void 0;
    var SCEnvironment = /** @class */ (function (_super) {
        __extends(SCEnvironment, _super);
        // this and setCurrentWebsite method are needed because
        // current site id comes as an url parameter. (currentWebsite is set in the ServiceController)
        //private currentWebsite: Website;
        function SCEnvironment() {
            return _super.call(this) || this;
        }
        SCEnvironment.getInstance = function () {
            if (!this.instance) {
                this.instance = new SCEnvironment();
            }
            return this.instance;
        };
        SCEnvironment.prototype.setCurrentUrl = function (currentUrl) {
            this.currentUrl = currentUrl;
            this.host = this.currentUrl.replace(/^https?:\/\/([^/?#:]+).*$/, '$1');
        };
        SCEnvironment.prototype.getCurrentUrl = function () {
            return this.currentUrl;
        };
        SCEnvironment.prototype.getHost = function () {
            return this.host;
        };
        SCEnvironment.prototype.getCurrentWebsite = function () {
            return this.currentWebsite;
        };
        SCEnvironment.prototype.setCurrentWebsite = function (website) {
            this.currentWebsite = website;
        };
        SCEnvironment.prototype.getAbsoluteUrl = function (path) {
            var match = this.currentUrl.match(/https?[^$#]+/);
            var absoluteUrl = this.currentUrl;
            if (match && match[0]) {
                var urlArray = match[0].split('/');
                urlArray.pop();
                absoluteUrl = urlArray.join('/');
            }
            if (path[0] !== '/') {
                path = '/' + path;
            }
            return absoluteUrl + path;
        };
        return SCEnvironment;
    }(Environment_1.Environment));
    exports.SCEnvironment = SCEnvironment;
});
