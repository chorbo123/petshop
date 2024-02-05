/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
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
define("Wizard.StepModule.Migrated", ["require", "exports", "underscore", "wizard_module.tpl", "jQuery", "Utils", "GlobalViews.Message.View", "View"], function (require, exports, _, wizard_module_tpl, jQuery, Utils, GlobalViews_Message_View_1, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WizardStepModuleMigrated = void 0;
    var WizardStepModuleMigrated = /** @class */ (function (_super) {
        __extends(WizardStepModuleMigrated, _super);
        function WizardStepModuleMigrated(options) {
            var _this = _super.call(this) || this;
            _this.tagName = 'article';
            _this.template = wizard_module_tpl;
            _this.errors = [];
            _this.wizard = options.wizard;
            _this.step = options.step;
            _this.model = options.wizard.model;
            _this.moduleId = options.module_id || (_this.template ? _this.template.Name : '');
            // errors array in the configuration file completely overrides the default one.
            if (options.errors) {
                _this.errors = options.errors;
            }
            return _this;
        }
        // @method disableInterface General method to disable the module interface
        // called at the moment of submitting the step
        WizardStepModuleMigrated.prototype.disableInterface = function () { };
        // @method enableInterface General method to re-enable the module interface
        // called after getting an ERROR on submitting
        WizardStepModuleMigrated.prototype.enableInterface = function () { };
        // @method refresh Auxiliary method to refresh a module. It is implemented
        // by the OrderWizard to refresh titles
        WizardStepModuleMigrated.prototype.refresh = function () { };
        WizardStepModuleMigrated.prototype._render = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var ret;
            if (!this.isActive()) {
                ret = this.$el.empty();
            }
            else {
                this.$el.addClass('module-rendered');
                ret = _super.prototype.render.apply(this, args);
                // add the error message box to the module
                if (!this.$('[data-type="alert-placeholder-module"]').length) {
                    this.$el.prepend('<div data-type="alert-placeholder-module"></div>');
                }
                // we show module errors (if any) and remove the error object
                if (this.error) {
                    this.showError();
                }
            }
            // We trigger the resize event of the body as the DOM is changed
            // and some components might be positioned based on the body size
            jQuery(document.body).trigger('resize');
            return ret;
        };
        // @method submit by default, a module returns it's validation promise.
        // @returns {jQuery.Deferred}
        WizardStepModuleMigrated.prototype.submit = function () {
            return this.isValid();
        };
        // @method cancel @returns {jQuery.Deferred}
        WizardStepModuleMigrated.prototype.cancel = function () {
            return jQuery.Deferred().resolve();
        };
        // @method isValid validate resolves a promise because maybe it needs to
        // do some ajax for validation @returns {jQuery.Deferred}
        WizardStepModuleMigrated.prototype.isValid = function () {
            return jQuery.Deferred().resolve();
        };
        // @method isActive Base implementation to determines is a module is active
        // (can be submitted, rendered or just use) or not. @returns {Boolean}
        WizardStepModuleMigrated.prototype.isActive = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _.isFunction(this.options.isActive) ? this.options.isActive.apply(this, args) : true;
        };
        // @method getTitle returns the title of the module, can be overridden in the
        // configuration file. @returns {String}
        WizardStepModuleMigrated.prototype.getTitle = function () {
            return _.isFunction(this.options.title)
                ? this.options.title.apply(this)
                : this.options.title || this.title || '';
        };
        // @method manageError @param {Wizard.Module.Error} error
        WizardStepModuleMigrated.prototype.manageError = function (error) {
            if (this.state !== 'future' && this.isActive()) {
                // @property {Wizard.Module.Error} error the current error object if any
                this.error = error;
                this.trigger('error', error);
                // if the module is being shown we show the error
                if (this.wizard.getCurrentStep() === this.step) {
                    this.showError();
                }
            }
        };
        // @method showError render the error message
        WizardStepModuleMigrated.prototype.showError = function () {
            var global_view_message = new GlobalViews_Message_View_1.GlobalViewsMessageView({
                message: this.error.errorMessage,
                type: 'error',
                closable: true
            });
            // Note: in special situations (like in payment-selector), there are modules
            // inside modules, so we have several place holders, so we only want to show
            // the error in the first place holder.
            var error_container = this.$('[data-type="alert-placeholder-module"]:first');
            var error_container_parent = error_container.parents('.module-rendered:last');
            if (error_container_parent.length) {
                // may be more than one, we are interested in the last one
                Utils.animatedScroll(error_container_parent[0]);
            }
            error_container.html(global_view_message.render().$el.html());
            this.error = null;
        };
        // @method clearError empty the error message container
        WizardStepModuleMigrated.prototype.clearError = function () {
            this.$('[data-type="alert-placeholder-module"]').empty();
            this.error = null;
        };
        // @method clearGeneralMessages General method to clear any message at step level
        WizardStepModuleMigrated.prototype.clearGeneralMessages = function () {
            this.$('[data-type="alert-placeholder-module"]:first').empty();
        };
        // @method showGeneralMessage Notify a message (not just an error) at step level.
        // Type can be a boolean (true: for errors, false: for success) or string to add
        // a class alert-<type>
        WizardStepModuleMigrated.prototype.showGeneralMessage = function (message, type) {
            var message_type = _.isString(type) ? type : (type && 'error') || 'success';
            var global_view_message = new GlobalViews_Message_View_1.GlobalViewsMessageView({
                message: message,
                type: message_type,
                closable: true
            });
            this.$('[data-type="alert-placeholder-module"]:first').html(global_view_message.render().$el.html());
        };
        WizardStepModuleMigrated.prototype.getContext = function () {
            return {};
        };
        return WizardStepModuleMigrated;
    }(View_1.View));
    exports.WizardStepModuleMigrated = WizardStepModuleMigrated;
});

//# sourceMappingURL=Wizard.StepModule.Migrated.js.map
