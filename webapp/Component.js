jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.core.format.DateFormat");

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"lhsusextaction/model/models",
	//	"lhsusextaction/libs/moment",
	//	"lhsusextaction/libs/array_find",
	"sap/ui/core/routing/HashChanger"
], function (UIComponent, Device, models, HashChanger) {
	"use strict";

	return UIComponent.extend("lhsusextaction.Component", {

		// metadata
		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			//	console.log(sap.ui.core.routing.HashChanger.getInstance().replaceHash(""));
			/*** 
			 * Reset the routing hash when refreshing the browser
			 */
			//	sap.ui.core.routing.HashChanger.getInstance().replaceHash("");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			var that = this;
			// Create a model for global file
			var globalModel = new sap.ui.model.json.JSONModel();
			// Create a model for data file 
			var dataModel = new sap.ui.model.json.JSONModel();
			// Define url 
			var url = "/nph-genericinterface.pl/Webservice/LighthouseConnectorREST";
			// Ajax call
			$.ajax({
				async: false,
				type: "POST",
				url: url + "/Session?UserLogin=ovolighthouse&Password=upaWFs2p4XViNrZ",
				success: function (response) {
					// Get SessionID 
					var sessionID = response.SessionID;
					// Create a model 
					var sessionModel = new sap.ui.model.json.JSONModel();
					// Set size limit
					sessionModel.setSizeLimit(999999999);
					// Set data to the model
					sessionModel.setData(sessionID);
					// Set to the view 
					that.setModel(sessionModel, "SessionModel");
				},
				error: function (err) {
					sap.m.MessageBox.alert(err);
				}
			});

			// Get private key 
			$.ajax({
				url: "/repoid/CMISProxyBridge/cmis/json",
				type: "GET",
				async: false,
				cache: false,
				error: function (error) {
					sap.m.MessageBox.alert("Private key is not found");
				},
				success: function (response) {
					// Get json object 
					var obj = response[Object.keys(response)[0]];
					var repoId = obj.repositoryId;

					// Access Action Tracker global file  
					$.ajax({
						url: "/cmis/" + repoId + "/root/ActionTrackerLHGlobalConfig.json",
						type: "GET",
						async: false,
						cache: false,
						success: function (oResponse) {
							// Create an Action Tracker model
							var actionModel = new sap.ui.model.json.JSONModel(oResponse);
							// Set data to the view 
							that.setModel(actionModel, "GlobalTrackerModel");

							// set the device model
							that.setModel(models.createDeviceModel(), "device");
							// Initialize the router
							that.getRouter().initialize();
						},
						error: function (err) {
							sap.m.MessageBox.alert("Global Tracker file is not found.");
							return false;
						}
					});
				}
			});
		},

		createContent: function () {

			// Root view
			var oRootView = sap.ui.view("appview", {
				type: sap.ui.core.mvc.ViewType.XML,
				viewName: "lhsusextaction.view.App"
			});

			return oRootView;
		}
	});
});