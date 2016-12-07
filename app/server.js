const http = require('http');
const url = require('url');
const ws = require("nodejs-websocket")
	

var STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

var width = 320,
	height = 240;

exports.startWSServer = () => {
	
	var srv = ws.createServer(function (conn) {
		console.log(conn.path);
		console.log("WS server Created");
		var streamHeader = new Buffer(8);
		streamHeader.write(STREAM_MAGIC_BYTES);
		streamHeader.writeUInt16BE(width, 4);
		streamHeader.writeUInt16BE(height, 6);
		conn.send(streamHeader, {binary:true});

		console.log( 'New WebSocket Connection ('+srv.connections.length+' total)' );

	    conn.on("close", function (code, reason) {
	        console.log( 'Disconnected WebSocket ('+srv.connections.length+' total)' );
	    });

	    conn.on("error", (err) => {
		    console.log("Connection abruptly closed: ");
		    console.log(err.stack);
		    console.log("closing");
		    conn.close();
		});
	});

	srv.broadcast = function(data, opts) {
		//Logic for subscribe
		srv.connections.forEach(function (conn) {
			
			var name = conn.path.split("=")[1];
			if(name.toLowerCase() == opts.name.toLowerCase()) {
				conn.send(data,opts);
			}

		});
	}

	srv.listen(8001);




	return srv;

}

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