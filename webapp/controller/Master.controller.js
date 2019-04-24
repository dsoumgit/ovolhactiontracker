/***
 * This page shows the list of navigation items under Created vs Closed Tickets, Point Consumption, and Functional
 *	Area Analysis for the current year. User can see the information about Open vs Closed tickets by Quarterly,
 *	Monthly, and Weekly. It also provides the Total Points Consumption by quarterly and monthly analysis.  
 *	Additionally, user can reach us via Contact Us section and find out Information description about the application   
 *		name. 
 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/EventBus"
], function (Controller) {
	"use strict";

	return Controller.extend("lhsusextaction.controller.Master", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			this.bus = sap.ui.getCore().getEventBus();
			//	this.bus = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView())).getEventBus();

			this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
		},

		onRouteMatched: function (oEvent) {
			var sName = oEvent.getParameter("name");

			if (sName === "master") {

				//	this.setFunctionalItems();
				this.setCurrentYear();
			}
		},

		setCurrentYear: function () {
			// Get current year 
			var currentYear = new Date().getFullYear();
			// Create an object 
			var obj = {};
			obj.AreaFunctional = [{
				"Year": currentYear,
				"key": "funcCurYear"
			}];
			// Create a model
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "Functional");
		},

		onItemPress: function (oEvent) {
			// Get the key from Global file 
			var key = oEvent.getSource().getBindingContext("Global").getObject().key; 
			// Navigate to the view 
			this.getRouter().navTo("itemDetail", {
				from: "master",
				entity: key
			});
			
		//	console.log(oItemID);
			
			//	this.oRouter.navTo("detail", {
			//		Id: oItemID
			//	});

			// Get object 
			//		var obj = oEvent.getSource().getBindingContext("Global").getObject();
			//console.log(obj.key);
			//	this.bus.publish("PointConsumption", "event2", obj.key, this); 
			//		var oModel = new sap.ui.model.json.JSONModel(obj.key); 
			//		sap.ui.getCore().setModel(oModel, "Item");

			//		this.oRouter.navTo("pointConsumption"); 
			// Navigate to the view 			
			//	this.oRouter.navTo(obj.key);
		},

		onAreaPress: function (oEvent) {
			// Get object 
			var obj = oEvent.getSource().getBindingContext("Functional").getObject();

			// Navigate to the view 			
			this.oRouter.navTo(obj.key);
		},

		onContactPress: function () {
			
			var contDialog = new sap.m.Dialog({
				title: "How you can contact us",
				icon: "sap-icon://contacts",
				contentWidth: "auto",
				contentHeight: "auto",
				content: new sap.m.FlexBox({
					height: "auto",
					alignItems: "Center",
					justifyContent: "Center",
					items: new sap.ui.layout.HorizontalLayout({
						content: [
							new sap.m.GenericTile({
								subheader: "Technical Assistance",
								textAlign: "Center",
								size: "S",
								tileContent: new sap.m.TileContent({
									content: new sap.m.FlexBox({
										alignItems: "Center",
										justifyContent: "Center",
										items: new sap.m.VBox({
											justifyContent: "Center",
											alignItems: "Center",
											items: [
												new sap.ui.core.Icon({
													src: "sap-icon://wrench"
												}),
												new sap.m.Link({
													text: "Get support for technical issues or questions",
													//	href: "mailto:lighthouse@revealvalue.com?Subject=Lighthouse Support Request",
													textAlign: "Center",
													wrapping: true,
													textDirection: "LTR"
												})
											]
										})
									})
								}),
								press: function (oEvent) {
									// Open mail 
									window.location.href = "mailto:revealsupport@revealvalue.com?Subject=Reveal Lighthouse Support Request";
								}
							}).addStyleClass("sapUiSmallMarginBegin"),
							new sap.m.GenericTile({
								subheader: "Non-Technical Assistance",
								textAlign: "Center",
								size: "S",
								tileContent: new sap.m.TileContent({
									content: new sap.ui.layout.HorizontalLayout({
										content: new sap.m.FlexBox({
											alignItems: "Center",
											justifyContent: "Center",
											items: new sap.m.VBox({
												justifyContent: "Start",
												alignItems: "Center",
												items: [
													new sap.ui.core.Icon({
														src: "sap-icon://email"
													}),
													new sap.m.Link({
														text: "Ask any other questions",
														textAlign: "Center",
														wrapping: true,
														textDirection: "LTR"
													})
												]
											})
										})
									})
								}),
								press: function (oEvent) {
									// Open mail 
									window.location.href = "mailto:lighthouse@revealvalue.com?Subject=Reveal Lighthouse Support Request";
								}
							}).addStyleClass("sapUiSmallMarginBegin")
						]
					})
				}).addStyleClass("sapUiMediumMarginBeginEnd sapUiMediumMarginTopBottom"),
				beginButton: new sap.m.Button({
					text: "Close",
					press: function () {
						// Close contact us dialog
						contDialog.close();
					}
				})
			});

			// Open contact us dialog
			contDialog.open();
		},

		onInfoPress: function () {
			// Access manifest file for sap.app
			var manifest = this.getOwnerComponent().getManifestEntry("sap.app");
			// Get app version 
			var appVersion = manifest.applicationVersion.version;
			// Get GlobalTrackerModel model
			var globalTrackerModel = this.getOwnerComponent().getModel("GlobalTrackerModel");
			// Get global data 
			var globalTrackerData = globalTrackerModel.getData();
			// Add trademark symbol
			var tradeMark = "\u2122";
			// Create a dialog for Information
			var infoDialog = new sap.m.Dialog({
				title: "Information",
				icon: "sap-icon://message-information",
				contentWidth: "auto",
				contentHeight: "auto",
				content: new sap.m.FlexBox({
					height: "100px",
					alignItems: "Center",
					justifyContent: "Center",
					items: new sap.ui.layout.VerticalLayout({
						content: [
							new sap.m.Text({
								text: "App Name: " + globalTrackerData.ClientName + " oVo Lighthouse" + tradeMark + " Action Tracker",
								textAlign: "Center"
							}),
							new sap.m.Text({
								text: "App Version: " + appVersion,
								textAlign: "Center"
							}),
							new sap.ui.layout.HorizontalLayout({
								content: [
									new sap.m.Text({
										text: "Contact Info: ",
										textAlign: "Center"
									}),
									new sap.m.Link({
										text: " lighthouse@revealvalue.com",
										href: "mailto:lighthouse@revealvalue.com?Subject=Lighthouse Support Request"
									})
								]
							})
						]
					})
				}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginEnd"),
				beginButton: new sap.m.Button({
					text: "Close",
					press: function () {
						infoDialog.close();
					}
				})
			});

			infoDialog.open();
		},
		
		asonInfoPress: function () {
			// Access manifest file for sap.app
			var manifest = this.getOwnerComponent().getManifestEntry("sap.app");
			// Get app version 
			var appVersion = manifest.applicationVersion.version;
			// Get GlobalTrackerModel model
			var globalTrackerModel = this.getOwnerComponent().getModel("GlobalTrackerModel");
			// Get global data 
			var globalTrackerData = globalTrackerModel.getData();
			// Add trademark symbol
			var tradeMark = "\u2122";
			var space = " ";
			var infoDialog = new sap.m.Dialog({
				title: "Information",
				icon: "sap-icon://message-information",
				contentWidth: "auto",
				contentHeight: "auto",
				content: new sap.m.FlexBox({
					height: "100px",
					alignItems: "Center",
					justifyContent: "Center",
					items: new sap.ui.layout.VerticalLayout({
						content: [
							new sap.m.Text({
								text: "App Name: " + globalTrackerData.ClientName + " oVo Lighthouse" + tradeMark + " Action Tracker",
								textAlign: "Center"
							}),
							new sap.m.Text({
								text: "App Version: " + appVersion,
								textAlign: "Center"
							}),
							new sap.ui.layout.HorizontalLayout({
								content: [
									new sap.m.Text({
										text: "Contact Info: " + space,
										textAlign: "Center"
									}),
									new sap.m.Link({
										text: " lighthouse@revealvalue.com",
										href: "mailto:lighthouse@revealvalue.com?Subject=Lighthouse Support Request"
									})
								]
							})
						]
					})
				}),
				beginButton: new sap.m.Button({
					text: "Close",
					press: function () {
						infoDialog.close();
					}
				})
			});

			infoDialog.open();
		},
		
		onLinkPress: function () {

			//	window.open("https://flpnwc-bb8bd811a.dispatcher.us1.hana.ondemand.com/sites?siteId=0fad276b-74be-4bd9-bd04-877e81a76ffa#lhsusint-Display&/", "_self");

			// get a handle on the global XAppNav service
			/*var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); 
			oCrossAppNavigator.isIntentSupported(["lhsusint-display"])
				.done(function(aResponses) {

				})
				.fail(function() {
					new sap.m.MessageToast("Provide corresponding intent to navigate");
				});
			// generate the Hash to display a employee Id
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "lhsusint",
					action: "display"
				}
			})) || ""; 
			//Generate a  URL for the second application
			var url = window.location.href.split('#')[0] + hash; 
			//Navigate to second app
			sap.m.URLHelper.redirect(url, true); 	*/
		},

		getEventBus: function () {
			return sap.ui.getCore().getEventBus();
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}
	});
});