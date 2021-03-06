const views = require('./views');
const url = require('url');
const util = require('util');
const exec = require('child_process').exec;
const fs = require('fs');

module.exports = (_config,_wsserver) => {

	var config = _config;
	var wsserver = _wsserver;

	return {

		index: (request,response) => {

			views.getView('index',response,(data) => {
				response.end(data);
			});

			

		},

		streamfile: (request,response) => {
			
			var urlObj = url.parse(request.url, true);
			var query = urlObj.query;
			var vidName = query.name;
			var idx = query.index;
			var cmd = (vidName == 'webcam')?"ffmpeg -f avfoundation -i \"0\" -target pal-vcd http://localhost:4321/stream":"ffmpeg -i ./app/data/"+vidName+" -f mpeg1video -framerate 30 http://localhost:4321/stream?name="+vidName;
			exec(cmd, function (error, stdout, stderr) {
			  console.log('stdout: ' + stdout);
			  console.log('stderr: ' + stderr);
			  if (error !== null) {
			    console.log('exec error: ' + error);
			  }
			});

			response.end("");
		},

		stream: (request,response) => {
			response.connection.setTimeout(0);
			var body = [];
			request.on('data', function(chunk) {
			  wsserver.broadcast(chunk, {binary:true});
			}).on('end', function() {
				wsserver.close();
			});



		},

		getjs: (request,response) => {

			var urlObj = url.parse(request.url, true);
			var query = urlObj.query;
			var vidName = query.name;
			fs.readFile('app/Templates/'+vidName, 'utf8', function (err, data) {
				if (err) throw err;
				response.writeHead(200,{'Content-Type':'html'});
				response.end(data);
			});
		}
	};



}

//ffmpeg -i Carousselle.mp4 -f mpeg1video http://localhost:4321/stream