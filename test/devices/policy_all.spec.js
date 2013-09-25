/*******************************************************************************
*  Code contributed to the webinos project
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* Copyright 2012 Telecom Italia Spa
*******************************************************************************/

var pmlib;
var fs = require("fs");
var path = require("path");
var pm;
var userPolicyFile = "./policy.xml";
var rootPolicyFile = './rootPolicy.xml';

var serviceList = [
	"service1",
	"service2",
	"service3",
    "service4"
	];

var userList = [
	"owner",
	"friend1",
	"friend2",
    "friend3"
	];

var deviceList = [
	"Phone",
	"Car",
	"TV",
    "Tablet",
    "Laptop"
	];

var policyList = [
	"policy_devices.xml"
	];


function loadManager() {
	pmlib = require(path.join(__dirname, "../../lib/policymanager.js"));
	pm = new pmlib.policyManager(path.join(__dirname, rootPolicyFile));
	return pm;
}


function changepolicy(fileName) {
	console.log("Change policy to file "+fileName);
	var data = fs.readFileSync(path.join(__dirname, fileName));
	fs.writeFileSync(path.join(__dirname, userPolicyFile), data);
}

function setServiceRequest(userId, service, deviceId, purpose, obligations, environment) {
	console.log("Setting request for user "+userId+", device "+deviceId+
		", service "+service);
	var req = {};
	var ri = {};
	var si = {};
	var wi = {};
	var di = {};
	si.userId = userId;
	req.subjectInfo = si;
	di.requestorId = deviceId;
		req.deviceInfo = di;
	ri.serviceId = service;
	req.resourceInfo = ri;
	return req;
}

var TestWrapper = function () {
  this.complete = false;
  this.result = -1;
};

function checkService(policyName, userName, serviceName, deviceId) {
	changepolicy(policyName);
	pm = loadManager();

	var req = setServiceRequest(userName, serviceName, deviceId);

	var testWrap = new TestWrapper();

	// noprompt (third parameter) set to true
	pm.enforceRequest(req, 0, true, function(res) {
	console.log("result is: " + res);
	testWrap.result = res;
	testWrap.complete = true;
  });

  return testWrap;
}

describe("Manager.PolicyManager", function() {

	it("Policy with devices", function() {
        // owner + phone
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[0], deviceList[0]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[1], deviceList[0]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[2], deviceList[0]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[3], deviceList[0]);
			expect(res.result).toEqual(0);
		});
        // owner + phone
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[0], deviceList[1]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[1], deviceList[1]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[2], deviceList[1]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[3], deviceList[1]);
			expect(res.result).toEqual(0);
		});
        // owner + TV (default rule, allow all)
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[0], deviceList[2]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[1], deviceList[2]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[2], deviceList[2]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[0], serviceList[3], deviceList[2]);
			expect(res.result).toEqual(0);
		});
        // friend1 + TV
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[0], deviceList[2]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[1], deviceList[2]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[2], deviceList[2]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[3], deviceList[2]);
			expect(res.result).toEqual(1);
		});
        // friend1 + Tablet
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[0], deviceList[3]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[1], deviceList[3]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[2], deviceList[3]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[3], deviceList[3]);
			expect(res.result).toEqual(1);
		});
        // friend1 + Laptop (default rule, deny all)
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[0], deviceList[4]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[1], deviceList[4]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[2], deviceList[4]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[1], serviceList[3], deviceList[4]);
			expect(res.result).toEqual(1);
		});
        // friend2 + Laptop
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[0], deviceList[4]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[1], deviceList[4]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[2], deviceList[4]);
			expect(res.result).toEqual(0);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[3], deviceList[4]);
			expect(res.result).toEqual(1);
		});
        // friend2 + Phone
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[0], deviceList[0]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[1], deviceList[0]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[2], deviceList[0]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[3], deviceList[0]);
			expect(res.result).toEqual(0);
		});
        // friend2 + Car (default rule, deny all)
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[0], deviceList[1]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[1], deviceList[1]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[2], deviceList[1]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[2], serviceList[3], deviceList[1]);
			expect(res.result).toEqual(1);
		});
        // friend3 (default rule, deny all)
		runs(function() {
			var res = checkService(policyList[0], userList[3], serviceList[0], deviceList[3]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[3], serviceList[1], deviceList[2]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[3], serviceList[2], deviceList[1]);
			expect(res.result).toEqual(1);
		});
		runs(function() {
			var res = checkService(policyList[0], userList[3], serviceList[3], deviceList[0]);
			expect(res.result).toEqual(1);
		});
	});

});
