sap.ui.define([], function () {
	"use strict";
	return {
		// Function to display the text instead of Priority number 
		formatPriority: function (oPriority) {
			var priority = "";
			// Change each priority number to the word 
			if (oPriority === 2) {
				priority = "Low";
			} else if (oPriority === 3) {
				priority = "Medium";
			} else if (oPriority === 4) {
				priority = "High";
			}

			// Return it 
			return priority;
		},

		// Function to display the text instead of StateID number 
		stateFormat: function (oState) {
			var stateID = "";
			// Change each priority number to the word 
			if (oState === 2 || oState === 11) {
				stateID = "Closed";
			} else if (oState === 3) {
				stateID = "Resolved - Solution Documented";
			} else if (oState === 4) {
				stateID = "Open";
			}

			// Return it 
			return stateID;
		},

		// Formatting date  
		dateFormat: function (oDate) {
			// Date format 
			var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MM/dd/yyyy",
				UTC: true
			});

			return oFormat.format(new Date(oDate));
		},

		// Formatting Value Opportunity  
		valueOppFormat: function (oValue) {
			//	console.log(oValue); 
			// Define a variable 
			var name = "";
			// Change the number to text 
			if (oValue === 1) {
				name = "Operation Improvement";
			} else if (oValue === 2) {
				name = "Data Accuracy";
			} else if (oValue === 3) {
				name = "Decision Making";
			} else if (oValue === 4) {
				name = "Service Level";
			} else if (oValue === 5) {
				name = "Inventory Optimization";
			} else if (oValue === 6) {
				name = "Continuous Improvement";
			} else if (oValue === 7) {
				name = "Cost Avoidance";
			} /*else if (oValue === "" || oValue === null || isNaN(oValue) === true) {
				name = "N/A";
			} */ else if (oValue === 8) {
				name = "Cost Savings";
			} else {
				name = "N/A";
			}

			// Return the name 
			return name;
		},

		// Function to return the url based on TicketID 
		getUrl: function (oTicketId) {
			var url = "https://actiontracker.revealvalue.com/otrs/index.pl?Action=AgentTicketZoom;TicketID=" + oTicketId;
			// Return url 
			return url;
		},

		// Filter only "DueDate" fields from DynamicField
		dueDate: function (arr) {
			// Define variable 
			var fullDate = "";
			// Check if null or no length 
			if (arr === null || arr === undefined) {
				// Return empty 
				return "";
			} else {
				// Filter by "DueDate"
				arr.filter(function (elem) {
					// Get Name fields 
					var name = elem.Name;
					// Return only "DueDate"
					return (name === "DueDate");
				}).forEach(function (obj) {
					// Get Value 
					var value = obj.Value;
					// Check if null or undefined 
					if (value !== null || value !== undefined) {
						// Set date to variable 
						fullDate = new Date(value);
					}
				});

				// Date format 
				var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "MM/dd/yyyy",
					UTC: true
				});
				// Return full date 
				return oFormat.format(fullDate);
			}
		},

		// Filter by SourceProcess
		getSourceProcess: function (arr) {
			// Define variable 
			var sourceProcess = "";
			if (arr === null || arr === undefined) {
				return "";
			} else {
				// filter the array 
				arr.filter(function (elem) {
					// Get Name field 
					var name = elem.Name;
					// Return SourceProcess 
					return (name === "SourceProcess");
				}).forEach(function (ele) {
					// Get the name 
					var value = Number(ele.Value); // parse to number type 
					// Check the SourceProcess and change to description
					if (value === 0) {
						sourceProcess = "N/A";
					} else if (value === 1) {
						sourceProcess = "Supply Chain";
					} else if (value === 2) {
						sourceProcess = "S&OP";
					} else if (value === 3) {
						sourceProcess = "Demand Management";
					} else if (value === 4) {
						sourceProcess = "Procurement";
					} else if (value === 5) {
						sourceProcess = "Production";
					} else if (value === 6) {
						sourceProcess = "Logistics";
					} else if (value === 7) {
						sourceProcess = "Customer Service";
					} else if (value === 8) {
						sourceProcess = "Project Systems";
					} else if (value === 9) {
						sourceProcess = "FI/CO";
					} else if (value === 10) {
						sourceProcess = "Warehouse";
					} else if (value === 11) {
						sourceProcess = "Plant Maintenance";
					} else {
						sourceProcess = "N/A";
					}
				});

				// Return SourceProcess
				return sourceProcess;

			}
		},

		// Filter by Value Opportunity
		getValueOpp: function (arr) {
			// Define variable 
			var valueOpp = "";
			if (arr === null || arr === undefined) {
				return "";
			} else {
				// filter the array 
				arr.filter(function (elem) {
					// Get Name field 
					var name = elem.Name;
					// Return SourceProcess 
					return (name === "ValueOpportunity");
				}).forEach(function (ele) {
					// Get the name 
					var oValue = Number(ele.Value); // parse to number type 
					// Check the SourceProcess and change to description
					if (oValue === 1) {
						valueOpp = "Operation Improvement";
					} else if (oValue === 2) {
						valueOpp = "Data Accuracy";
					} else if (oValue === 3) {
						valueOpp = "Decision Making";
					} else if (oValue === 4) {
						valueOpp = "Service Level";
					} else if (oValue === 5) {
						valueOpp = "Inventory Optimization";
					} else if (oValue === 6) {
						valueOpp = "Continuous Improvement";
					} else if (oValue === 7) {
						valueOpp = "Cost Avoidance";
					} /*else if (oValue === "" || oValue === null || oValue === undefined || isNaN(oValue) === true) {
						valueOpp = "N/A";
					} */ else if (oValue === 8) {
						valueOpp = "Cost Savings";
					} else {
						valueOpp = "N/A";
					}
				});

				// Return SourceProcess
				return valueOpp;

			}
		}
	};
});