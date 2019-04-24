sap.ui.define([
	"lhsusextaction/controller/BaseController",
	"sap/ui/commons/Carousel",
	"sap/ui/table/Table",
	"sap/ui/table/Column",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format",
	"lhsusextaction/model/formatter" // include the formatter js 
], function (BaseController, Carousel, Table, Column, ChartFormatter, Format, formatter) {
	"use strict";

	return BaseController.extend("lhsusextaction.controller.Detail", {
		// Formatter 
		formatter: formatter,

		onInit: function () {

			this.bus = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView())).getEventBus();

			this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
		},

		onRouteMatched: function (oEvent) {
			var sName = oEvent.getParameter("name");

			if (sName === "master") {
				// Get vizframe id for Priority Chart 
				var oVizFrame1 = this.getView().byId("idVizframe1");
				// Set color properties 
				oVizFrame1.setVizProperties({
					plotArea: { // low		// medium	// high
						colorPalette: ["#5DB9E6", "#B6D957", "#E8743B", "#18A979", "#E3CA12", "#6112E3", "#12CAE3"]
					},
					interaction: {
						selectability: {
							mode: "single"
						}
					}
				});

				// Get pop over id 
				var idPopover1 = this.getView().byId("idPopover1");
				idPopover1.connect(oVizFrame1.getVizUid());
				idPopover1.setFormatString(ChartFormatter.DefaultPattern.Integer);
				// Get vizframe id for StateID chart 
				var oVizFrame2 = this.getView().byId("idVizframe2");
				// Set color properties 
				oVizFrame2.setVizProperties({
					plotArea: {
						colorPalette: ["#5DB9E6", "#B6D957", "#E8743B", "#18A979", "#E3CA12", "#6112E3", "#12CAE3"]
					},
					interaction: {
						selectability: {
							mode: "single"
						}
					}
				});
				// Get pop over id 
				var idPopover2 = this.getView().byId("idPopover2");
				idPopover2.connect(oVizFrame2.getVizUid());
				idPopover2.setFormatString(ChartFormatter.DefaultPattern.Integer);

				// Get vizframe id for Value Opportunity chart 
				var oVizFrame3 = this.getView().byId("idVizframe3");
				// Set color properties 
				oVizFrame3.setVizProperties({
					plotArea: {
						colorPalette: ["#5DB9E6", "#B6D957", "#E8743B", "#18A979", "#E3CA12", "#6112E3", "#12CAE3"]
					},
					interaction: {
						selectability: {
							mode: "single"
						}
					}
				});
				// Get pop over id 
				var idPopover3 = this.getView().byId("idPopover3");
				idPopover3.connect(oVizFrame3.getVizUid());
				idPopover3.setFormatString(ChartFormatter.DefaultPattern.Integer);

				// Turn on data label by default for three charts 
				// Get all three states 
				// Chart 1 
				//	var chart1State = this.getView().byId("chart1Per").getState(); 
				// Priority Chart (show value)
				this.onDataShowLabel("value", oVizFrame1, true);
				// Chart 2 
				//	var chart2State = this.getView().byId("chart2Per").getState();  
				// Priority Chart 
				this.onDataShowLabel("value", oVizFrame2, true);
				// Chart 3
				//	var chart3State = this.getView().byId("chart3Per").getState();
				// Priority Chart 
				this.onDataShowLabel("value", oVizFrame3, true);
				// Call function to set data to the view 
				this.onOTRSRequestAll();
			}
		},

		// Function to return all the tickets and bind the data to the view 
		onOTRSRequestAll: function () {
			// show busy indicator 
			this.getView().setBusy(true);
			// Scope variable 
			var that = this;
			// Get Session Model from Component 
			var sessionID = this.getView().getModel("SessionModel").getData();
			// Define url 
			var url = "/nph-genericinterface.pl/Webservice/LighthouseConnectorREST";
			// Get Customer ID 
			var customerID = this.getView().byId("customerSelect").getSelectedKey();
			
			// Check if CustomerID is All
			if (customerID !== "All") {
				url = url + "/Ticket?SessionID=" + sessionID + "&CustomerID=" + customerID;
			} else {
				url = url + "/Ticket?SessionID=" + sessionID;
			}

			// Do Ajax call to get all tickets 
			$.ajax({
				async: false,
				type: "GET",
				url: url,
				success: function (oResponse) {
					// Get all tickets 
					var ticketArr = oResponse.TicketID;

					// Call function to loop each ticket and set data to the view 
					that.setDataView(sessionID, ticketArr);
				},
				error: function (err) {
					sap.m.MessageBox.alert(err);
				}
			});
		},

		// Function to return the result for StateID based on Closed and Open states 
		getStateID: function (arr) {
			// copy an array 
			var items = arr.slice();
			// count variable 
			var counts = {};
			// loop through array 
			items.forEach(function (elem) {
				// if State is defined in an object  
				if (counts[elem.State]) {
					// increment each count 
					counts[elem.State]++;
				} // add to the count object and start at 1
				else {
					counts[elem.State] = 1;
				}
			});

			// scope variable 
			var that = this;
			// Get pop over id 
			var popOver = this.getView().byId("idPopover2");
			// Function expression to get the array value selected from the chart data 
			//	 and store it in the model, so we can pass as an argument to the odata call. 
			var getDataPoint = function (oEvent) {
				// Get the number of value selected 
				var selectedValues = oEvent.getSource().vizSelection();
				// add Action pop over 
				popOver.setActionItems([{
					type: "action",
					text: "Show Details",
					press: function () {
						// get selected State 
						var selectedData = selectedValues[0].data.State;

						// create a new array 
						var output = [];
						// iterate through array 
						items.forEach(function (item) {
							// check the State and selected State 
							if (item.State === selectedData) {
								// store objects to new array 
								output.push(item);
							}
						});

						// call function to open the dialog 
						that.onActionPopup(output);
					}
				}]);
			};

			var oVizFrame = this.getView().byId("idVizframe2");
			// Get data on selected point 
			oVizFrame.attachSelectData(jQuery.proxy(getDataPoint, this));

			// Create an array output to store collection 
			var output = [];
			// Create name properties for each State 
			for (var k in counts) {
				output.push({
					"State": k,
					"Total": counts[k]
				});
			}

			// return the result 
			return output;
		},

		// Function to set the data for all sections 
		setDataView: function (sessionID, arr) {
			// Scope variable 
			var that = this;
			// Copy an array 
			var ticketArr = arr.slice();
			// Create a new array to store all the objects for each ticket 
			var result = [];

			// Loop through ticket array
			for (var i = 0; i < ticketArr.length; i++) {
				$.ajax({
					async: false,
					type: "GET",
					url: "/nph-genericinterface.pl/Webservice/LighthouseConnectorREST" + "/Ticket/" + ticketArr[i] + "?SessionID=" + sessionID,
					success: function (oResponse) {

						// Store each object in a new array 
						result.push(oResponse.Ticket[0]);
					},
					error: function (err) {
						sap.m.MessageBox.alert(err);
					}
				});
			}

			// Create new objects 
			var outputPriority = {};
			// Create a new array to store data report 
			var dataReport = [];

			/****** Open Actions by Priority Chart **********************
			 * Create Pie/Donut chart based on Priority and StateType = "open"
			 * take Priority Descriptions from Priority attribute
			 * 
			 *************************************************************/
			// Filter by StateID 
			result.filter(function (obj) {
				// Get each StateType 
				var stateType = obj.StateType;
				// Check StateType (4 = open) 
				return (stateType === "open");
			}).forEach(function (elem) {
				// Get each Priority 
				var priority = elem.Priority; // convert to integer
				// if not defined 
				if (outputPriority[priority] === undefined) {
					// add each object to the array 
					outputPriority[priority] = [elem];
				} else {
					// already found, keep adding it
					outputPriority[priority].push(elem);
				}

				/**** Table report section ****/
				// Get DynamicField
				var dynamicField = elem.DynamicField;
				// Loop through 
				for (var j = 0; j < dynamicField.length; j++) {
					// Get Name fields
					var name = dynamicField[j].Name;
					// Get Value fields
					var value = Number(dynamicField[j].Value); // parse to integer type  
					// Check where Name = Top5 and Value = 1
					if (name === "Top5" && value === 1) {
						// Store each object to new array 
						dataReport.push(elem);
					}
				}
			});

			// Get pop over id 
			var idPopover1 = this.getView().byId("idPopover1");

			// Function expression to get the array value selected from the chart data 
			//	 and store it in the model, so we can pass as an argument to the odata call. 
			var getDataPoint = function (oEvent) {
				// Get the number of value selected 
				var selectedValues = oEvent.getSource().vizSelection();
				// add Action pop over 
				idPopover1.setActionItems([{
					type: "action",
					text: "Show Details",
					press: function () {
						// get selected Priority 
						var selectedData = selectedValues[0].data.Priority;
						// create a new array 
						var output = {};
						// loop through array and get data property 
						for (var k in outputPriority) {
							// console.log(str);
							if (k === selectedData) {
								// store array in a new object 
								output = outputPriority[k];
							}
						}

						// call function to open the dialog 
						that.onActionPopup(output);
					}
				}]);
			};

			// get Priority chart id
			var oVizFrame = this.getView().byId("idVizframe1");
			// Get data on selected point 
			oVizFrame.attachSelectData(jQuery.proxy(getDataPoint, this));

			// Create name properties for each Priority 
			var resultPriority = [];
			for (var key in outputPriority) {
				resultPriority.push({
					"Priority": key,
					"Total": outputPriority[key].length
				});
			}
			/********************** End ************************************/

			// Create a new object to store the array of collection
			var obj = {};
			// Store Priority results 
			obj.PriorityCollection = resultPriority;
			// Store StateID results
			obj.StateIDCollection = that.getStateID(result);
			// Store report results 
			obj.DataCollection = dataReport;
			// Store Value Opportunity results
			obj.ValueOppCollection = that.getValueOpportunity(result); // Call function to get Value Opportunity 
			// Store Cost Avoid
			obj.CostAvoid = that.getCostAvoid(result); // Call function to get Cost Avoid $$ 
			// Store Priority Items collection 
			obj.ItemsCollection = that.getPriorityItems(result); // Call function to get Priority 1 Open items

			// Create a model
			var oModel = new sap.ui.model.json.JSONModel(obj);
			// set size limit 
			oModel.setSizeLimit(999999999);
			// Set model to the view 
			that.getView().setModel(oModel);

			// hide busy indicator 
			that.getView().setBusy(false);
		},

		// function to show the dialog with table view 
		onActionPopup: function (arr) {
			// create a new object 
			var obj = {};
			// store array collection
			obj.results = arr;
			// Create a new model 
			var listModel = new sap.ui.model.json.JSONModel(obj);
			// set size limit 
			listModel.setSizeLimit(999999999);

			// Create table
			var table = new Table({
				selectionMode: "None",
				alternateRowColors: true,
				visibleRowCount: arr.length, // get the length 
				enableSelectAll: false,
				threshold: arr.length, // get the length 
				enableBusyIndicator: true
			});

			// Request Number column 
			var reqNumber = new Column({
				hAlign: "Center",
				width: "8em",
				autoResizable: true,
				sortProperty: "TicketNumber",
				filterProperty: "TicketNumber",
				filterType: "sap.ui.model.type.Integer",
				label: new sap.m.Label({
					text: "Request Number",
					wrapping: true
				}),
				template: new sap.m.Link({
					text: "{TicketNumber}",
					emphasized: false,
					href: "{TicketID}",
					target: "_blank",
					wrapping: true,
					press: function (evt) {
						// get href
						var ticketID = evt.getSource().getHref();
						// build url string 
						var url = "https://actiontracker.revealvalue.com/otrs/index.pl?Action=AgentTicketZoom;TicketID=" + ticketID;
						// open a link 
						window.open(url, "_blank");
					}
				})
			});

			// Description column 
			var description = new Column({
				hAlign: "Center",
				width: "17em",
				autoResizable: true,
				//	sortProperty: "Title",
				//	filterProperty: "Title",
				//	filterType: "sap.ui.model.type.String",
				label: new sap.m.Label({
					text: "Title",
					wrapping: true
				}),
				template: new sap.m.Text({
					text: "{Title}",
					wrapping: true
				})
			});

			// Created
			var createdDate = new Column({
				width: "8em",
				hAlign: "Center",
				autoResizable: true,
				//	sortProperty: "Created",
				//	filterProperty: "Created",
				//	filterType: "sap.ui.model.type.Date",
				label: new sap.m.Label({
					text: "Created On",
					wrapping: true
				}),
				template: new sap.m.Text({
					text: {
						parts: [{
							path: "Created"
						}],
						formatter: function (Created) {
							//	return date format from formatter 
							return formatter.dateFormat(Created);
						}
					},
					wrapping: true
				})
			});

			// Due Date
			var dueDate = new Column({
				width: "8em",
				hAlign: "Center",
				autoResizable: true,
				label: new sap.m.Label({
					text: "Due Date",
					wrapping: true
				}),
				template: new sap.m.Text({
					text: {
						parts: [{
							path: "DynamicField"
						}],
						formatter: function (DynamicField) {
							//	return date format from formatter 
							return formatter.dueDate(DynamicField);
						}
					},
					wrapping: true
				})
			});

			// Owner column 
			var owner = new Column({
				hAlign: "Center",
				width: "8em",
				autoResizable: true,
				sortProperty: "Owner",
				filterProperty: "Owner",
				filterType: "sap.ui.model.type.String",
				label: new sap.m.Label({
					text: "Assigned To",
					wrapping: true
				}),
				template: new sap.m.Text({
					text: "{Owner}",
					wrapping: true
				})
			});

			// Functional Area
			var funcArea = new Column({
				hAlign: "Center",
				width: "10em",
				autoResizable: true,
				label: new sap.m.Label({
					text: "Functional Area",
					wrapping: true
				}),
				template: new sap.m.Text({
					text: {
						parts: [{
							path: "DynamicField"
						}],
						formatter: function (DynamicField) {
							//	return date format from formatter 
							return formatter.getSourceProcess(DynamicField);
						}
					},
					wrapping: true
				})
			});

			// Priority column 
			var priority = new Column({
				hAlign: "Center",
				width: "15em",
				autoResizable: true,
				sortProperty: "Priority",
				filterProperty: "Priority",
				filterType: "sap.ui.model.type.String",
				label: new sap.m.Label({
					text: "Priority",
					wrapping: true
				}),
				template: new sap.m.Text({
					text: "{Priority}",
					wrapping: true
				})
			});

			// Status column 
			var status = new Column({
				hAlign: "Center",
				width: "12em",
				autoResizable: true,
				sortProperty: "State",
				filterProperty: "State",
				filterType: "sap.ui.model.type.String",
				label: new sap.m.Label({
					text: "Status",
					wrapping: true
				}),
				template: new sap.m.Text({
					text: "{State}",
					wrapping: true
				})
			});

			// Value Opportunity column 
			var valueOpp = new Column({
				hAlign: "Center",
				width: "15em",
				autoResizable: true,
				sortProperty: "State",
				filterProperty: "State",
				filterType: "sap.ui.model.type.String",
				label: new sap.m.Label({
					text: "Value Opportunity",
					wrapping: true
				}),
				template: new sap.m.Text({
					text: {
						parts: [{
							path: "DynamicField"
						}],
						formatter: function (DynamicField) {
							//	return result from formatter
							return formatter.getValueOpp(DynamicField);
						}
					},
					wrapping: true
				})
			});

			// Add each column 
			table.addColumn(reqNumber);
			table.addColumn(description);
			table.addColumn(createdDate);
			table.addColumn(dueDate);
			table.addColumn(owner);
			table.addColumn(funcArea);
			table.addColumn(priority);
			table.addColumn(status);
			table.addColumn(valueOpp);

			// Set model to the table 
			table.setModel(listModel);
			// Bind rows 
			table.bindRows({
				path: "/results",
				parameters: {
					operationMode: "Server"
				}
			});

			// Create a dialog
			var dialog = new sap.m.Dialog({
				title: "Action Item List",
				showHeader: true,
				contentWidth: "100%",
				contentHeight: "auto",
				resizable: true,
				draggable: true,
				content: table,
				beginButton: new sap.m.Button({
					text: "Close",
					press: function () {
						// close dialog box 
						dialog.close();
					}
				}),
				afterClose: function () {
					// destroy dialog so it can reuse
					//	dialog.destroy();
				}
			});

			// open dialog 
			dialog.open();

		},

		// Function to set the visibility on data and value label by default and change event 
		onDataShowLabel: function (valueType, vizframeName, state) {
			// Show busy indicator
			sap.ui.core.BusyIndicator.show();
			// Set the visibility 
			vizframeName.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: state,
						type: valueType
					}
				}
			});

			// Hide busy indicator
			sap.ui.core.BusyIndicator.hide();
		},

		// Function to show the label on Priority Chart 
		onPriorityShowLabel: function (oEvent) {
			// Show busy indicator
			sap.ui.core.BusyIndicator.show();
			// Get State 
			var state = oEvent.getSource().getState();
			// Get vizframe id 1 
			var vizframe = this.getView().byId("idVizframe1");
			// Set the visibility 
			vizframe.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: state
					}
				}
			});

			// Hide busy indicator
			sap.ui.core.BusyIndicator.hide();
		},

		// Function to switch between "value" and "percentage"
		onValueLabelChange: function (vizframe, state) {
			// Define a value type 
			var value = "";
			// Check the State 
			if (state !== true) {
				// Show value 
				value = "value";
			}

			// Set the visibility 
			vizframe.setVizProperties({
				plotArea: {
					dataLabel: {
						type: value,
						hideWhenOverlap: false
					}
				}
			});
		},

		// Function to show the value or percentage
		onPriorityShowValue: function (oEvent) {
			// Get vizframe id 1 
			var vizframe = this.getView().byId("idVizframe1");
			// Get the State 
			var state = oEvent.getSource().getState();
			// Call function
			this.onValueLabelChange(vizframe, state);
		},

		// Function to show the label on State Chart 
		onStateShowLabel: function (oEvent) {
			// Show busy indicator
			sap.ui.core.BusyIndicator.show();
			// Get vizframe id 2 
			var vizframe = this.getView().byId("idVizframe2");
			// Get State 
			var state = oEvent.getSource().getState();
			// Set the visibility 
			vizframe.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: state
					}
				}
			});

			// Hide busy indicator
			sap.ui.core.BusyIndicator.hide();
		},

		// Function to show the value or percentage
		onStateShowValue: function (oEvent) {
			// Get vizframe id 2
			var vizframe = this.getView().byId("idVizframe2");
			// Get the State 
			var state = oEvent.getSource().getState();
			// Call function
			this.onValueLabelChange(vizframe, state);
		},

		// Function to show the label on Value Opportunity Chart 
		onValueOppShowLabel: function (oEvent) {
			// Show busy indicator
			sap.ui.core.BusyIndicator.show();
			// Get vizframe id 3 
			var vizframe = this.getView().byId("idVizframe3");
			// Get State 
			var state = oEvent.getSource().getState();
			// Set the visibility 
			vizframe.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: state
					}
				}
			});

			// Hide busy indicator
			sap.ui.core.BusyIndicator.hide();
		},

		// Function to show the value or percentage
		onValueOppShowValue: function (oEvent) {
			// Get vizframe id 3
			var vizframe = this.getView().byId("idVizframe3");
			// Get the State 
			var state = oEvent.getSource().getState();
			// Call function
			this.onValueLabelChange(vizframe, state);
		},

		// Event handler to change the customer ID 
		handleCustomerChange: function (event) {
			// Scope variable 
			var that = this;
			// Display busy indicator 
			sap.ui.core.BusyIndicator.show();
			// Get Customer name 
			var customerID = event.getSource().getSelectedKey();
			// Get Session Model from Component 
			var sessionID = this.getView().getModel("SessionModel").getData();
			// Define url 
			var url = "/nph-genericinterface.pl/Webservice/LighthouseConnectorREST";
			// Create a model
			var oModel = new sap.ui.model.json.JSONModel();
			// simulate end of operation
			jQuery.sap.delayedCall(2000, this, function () {
				// Do Ajax call to get all tickets 
				$.ajax({
					async: false,
					type: "GET",
					url: url + "/Ticket?SessionID=" + sessionID + "&CustomerID=" + customerID,
					success: function (oResponse) {
						// Check the response if no result returns  
						if (oResponse.TicketID !== undefined) {
							// Get all tickets 
							var ticketArr = oResponse.TicketID;

							// Call function to loop each ticket and set data to the view 
							that.setDataView(sessionID, ticketArr);
							// Hide busy indicator 
							sap.ui.core.BusyIndicator.hide();
						} else if (customerID === "All") {
							// Call function 
							that.onOTRSRequestAll();
							// Hide busy indicator 
							sap.ui.core.BusyIndicator.hide();
						} else {
							// Set data to empty 
							oModel.setData(null);
							// Set model to the view 
							that.getView().setModel(oModel);
							// Hide busy indicator 
							sap.ui.core.BusyIndicator.hide();
						}
					},
					error: function (oError) {
						sap.m.MessageBox.alert(oError.responseText);
						// Hide indicator
						sap.ui.core.BusyIndicator.hide();
					}
				});
			});
		},

		// Function to set value opportunity
		getValueOpportunity: function (arr) {
			// Copy an array 
			var result = arr.slice();
			// Create a new object to group by ValueOpportunity
			var output = {};
			// Get pop over id 
			var popOver = this.getView().byId("idPopover3");

			// scope variable
			var that = this;
			// Function expression to get the array value selected from the chart data 
			//	 and store it in the model, so we can pass as an argument to the odata call. 
			var getDataPoint = function (oEvent) {
				// Get the number of value selected 
				var selectedValues = oEvent.getSource().vizSelection();
				// add Action pop over 
				popOver.setActionItems([{
					type: "action",
					text: "Show Details",
					press: function () {
						// get selected Priority 
						var selectedData = selectedValues[0].data.Name;
						// create a new array 
						var results = [];
						// iterate through array to find the selected name 
						result.forEach(function (item) {
							// get Dynamic Field 
							var dynamicField = item.DynamicField;
							// state type
							var stateType = item.StateType; 
							// Get PriorityID field 
							var priorityID = Number(item.PriorityID); // parse to integer 
							// loop through name to find Value Opportunity
							dynamicField.forEach((elem) => {
								// get Value 
								var value = formatter.valueOppFormat(Number(elem.Value));
								// get Name
								var name = elem.Name;

								// check value 
								if (value === selectedData && name === "ValueOpportunity" && stateType === "open" && priorityID === 4) {
									// store objects to new array 
									results.push(item);
								}
							});
						});

						// call function to open the dialog 
						that.onActionPopup(results);
					}
				}]);
			};

			// get Value Opportunity chart id
			var oVizFrame = this.getView().byId("idVizframe3");
			// Get data on selected point 
			oVizFrame.attachSelectData(jQuery.proxy(getDataPoint, this));

			// Filter by PriorityID and StateID 
			result.filter(function (obj) {
				// Get PriorityID field 
				var priorityID = Number(obj.PriorityID); // parse to integer 
				// Get StateID
				//	var stateID = Number(obj.StateID); // parse to integer 
				var stateType = obj.StateType;
				// Return new array 
				return (priorityID === 4 && stateType === "open");
			}).forEach(function (elem) {
				// Get DynamicField 
				var dynamicField = elem.DynamicField;
				// Loop through array 
				for (var i = 0; i < dynamicField.length; i++) {
					// Get Name = ValueOpportunity
					var name = dynamicField[i].Name;
					// Check name 
					if (name === "ValueOpportunity") {
						// Check if name is not defined
						if (output[name] === undefined) {
							// add it to the array 
							output[name] = [dynamicField[i]];
						} else {
							// keep adding it
							output[name].push(dynamicField[i]);
						}
					}
				}
			});

			// Check the empty object 
			if (Object.keys(output).length !== 0) {
				// Group by key  
				output = output.ValueOpportunity.reduce(function (r, a) {
					r[a.Value] = r[a.Value] || [];
					r[a.Value].push(a);
					return r;
				}, Object.create(null));

				// Create a new array 
				var results = [];
				// Create property names 
				for (var key in output) {
					results.push({
						"Name": Number(key),
						"Total": output[key].length
					});
				}

				// Return the results 
				return results;
			}
		},

		// Function to set Cost Avoid $$
		getCostAvoid: function (arr) {
			// Copy an array 
			var result = arr.slice();
			// Define sum variable 
			var sum = 0;
			// Create a new array to store the result from filter based on ValueOpportunity and Value = 7
			var newResult = [];
			// Filter by StateID = 2 or StateID = 3
			result.filter(function (obj) {
				// Get StateType
				var stateType = obj.StateType;
				// Filter on closed state 
				return (stateType === "closed");
			}).forEach(function (elem) {
				// Get Dynamic Field 
				var dynamicField = elem.DynamicField;
				// Loop through array
				for (var i = 0; i < dynamicField.length; i++) {
					// Get Name field 
					var name = dynamicField[i].Name;
					// Get Value field 
					var value = Number(dynamicField[i].Value); // parse to number 
					// Check where value is 7
					if (name === "ValueOpportunity" && value === 7) {
						//	console.log(elem);
						newResult.push(elem);
					}
				}
			});

			// Loop through array to sum the total of Value for ValueDollar field 
			newResult.forEach(function (elem) {
				// Get Dynamic field
				var dynamicField = elem.DynamicField;
				// Loop through 
				for (var j = 0; j < dynamicField.length; j++) {
					// Get ValueDollar 
					var valueName = dynamicField[j].Name;
					// Then sum Value of Dynamic field ValueDollar
					// Get Name field that is ValueDollar 
					if (valueName === "ValueDollar") {
						// Get Value field 
						var valueDollar = dynamicField[j].Value;
						// Remove comma from string 
						var numValue = valueDollar.replace(/[,]/g, "");
						// Remove first character ($) and parse to number type
						var valDollarNum = parseFloat(numValue.substring(1));
						// Sum the value (note: ValueDollar has $)
						sum += valDollarNum;
					}
				}
			});

			// Formatting number
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 3,
				groupingEnabled: true,
				groupingSeparator: ",",
				decimalSeparator: ".",
				decimals: 2
			});

			// Set the sum to the view 
			//	this.getView().byId("costAvoid").setText("$" + oNumberFormat.format(sum));

			return "$" + oNumberFormat.format(sum);
		},

		// Function to get list of priority items 
		getPriorityItems: function (arr) {
			// Copy an array 
			var result = arr.slice();
			// Define a new array 
			var output = [];
			// Filter by StateType and PriorityID
			result.filter(function (obj) {
				// Get StateType
				var stateType = obj.StateType;
				// Get PriorityID
				var priorityID = Number(obj.PriorityID); // parse to number
				// Filter by StateType = "open" and PriorityID = 4
				if (stateType === "open" && priorityID === 4) {
					// Store objects to new array 
					output.push(obj);
				}
			});

			// Return the output 
			return output;
		},

		onRefresh: function () {
			console.log("refresh");
			// show busy indicator
			this.getView().setBusy(true);
			// simulate end of operation
			jQuery.sap.delayedCall(2000, this, function () {
				// refresh the view 
				this.getView().getModel().refresh(true);
				// hide busy indicator
				this.getView().setBusy(false);
			});

			//		
			//		this.getView().setBusy(false); 
			// Call function to do an Ajax call for getting all the tickets 
			//	this.onOTRSRequestAll();
			//	this.getView().byId("idVizframe1").getModel().refresh(true);
			//	this.onOTRSRequestAll();
		},

		onPDFPressed: function (oEvent) {
			var oTarget = this.getView(),
				sTargetId = oEvent.getSource().data("targetId");

			if (sTargetId) {
				oTarget = oTarget.byId(sTargetId);
			}

			if (oTarget) {
				var $domTarget = oTarget.$()[0],
					sTargetContent = $domTarget.innerHTML,
					sOriginalContent = document.body.innerHTML;

				document.body.innerHTML = sTargetContent;
				window.print();
				document.body.innerHTML = sOriginalContent;
			} else {
				jQuery.sap.log.error("onPrint needs a valid target container [view|data:targetId=\"SID\"]");
			}
		},

		getEventBus: function () {
			return sap.ui.getCore().getEventBus();
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}
	});
});