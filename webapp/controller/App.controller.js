/***
 * This page behaves as a SplitApp that divides between Master and Detail page. 
 * 
 */ 

sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("lhsusextaction.controller.App", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);	
		}
	});
});