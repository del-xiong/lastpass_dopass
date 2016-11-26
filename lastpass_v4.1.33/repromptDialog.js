var RepromptDialog=function(b){Dialog.call(this,b,{additionalHeaderClasses:["icon","leftIcon"],dynamicHeight:!0,responsive:!1,buttonsInsideContent:!0,nextButtonText:Strings.translateString("Continue"),title:Strings.translateString("Reprompt"),confirmOnClose:!1,overlayDialog:!0});this.numfailed=0};RepromptDialog.prototype=Object.create(Dialog.prototype);RepromptDialog.prototype.constructor=RepromptDialog;
(function(){var b=Strings.translateString("Invalid Password.");RepromptDialog.prototype.open=function(a){this.numfailed=0;Dialog.prototype.open.call(this,a)};RepromptDialog.prototype.success=function(){"function"===typeof this.data.successCallback&&this.data.successCallback()};RepromptDialog.prototype.error=function(){2>this.numfailed?(this.numfailed++,this.addError("password",b),this.inputFields.password.focus()):this.close()};RepromptDialog.prototype.validateReprompt=function(a){if("function"===
typeof this.data.validate)this.data.validate(a);else throw"Must override RepromptDialog.prototype.validate or pass a validate callback to dialogs.reprompt.open().";};RepromptDialog.prototype.handleSubmit=function(a){LPRequest.makeRequest(this.createDynamicHandler(function(a){var b=this;a.repromptFailed=function(){b.error();a.error("")};this.validateReprompt(a)}),{params:a,success:this.createDynamicHandler(this.success)})}})();
