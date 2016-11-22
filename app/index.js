
const server = require("./server");
const routes = require("./routes");
const actions = require("./actions");
const fs = require('fs');


var configFilePath = "./app/configs/config.json";
var config;

fs.readFile(configFilePath, 'utf8', function (err, data) {
	if (err) throw err;
	config = JSON.parse(data);
	var routeObj = routes(config);
	routeObj.registerRoutesFromConfig();
	var actionObj = actions(config);

	server.startServer(config,routeObj,actionObj);
});


