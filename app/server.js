const http = require('http');
const url = require('url');

	
exports.startServer = (config,routeObj,actionObj) => {
	http.createServer( (request,response) => {


		var urlObj = url.parse(`http://${request.url}`);

		response.writeHead(200,{'Content-Type':'json'});
		//response.end(urlObj.pathname);
		var actionStr = routeObj.getCallback(urlObj.pathname.toLowerCase(),request.method.toLowerCase());
		console.log(actionStr);
		var cb = actionObj[actionStr]?actionObj[actionStr]:() => console.log("Action does not exist!");
		cb.call(this,request,response);



	}).listen(4321);

	console.log("Running server at http://localhost:4321/");
}