const views = require('./views');
const url = require('url');
const util = require('util');
const exec = require('child_process').exec;
var _videos = {};//require('memory-cache');
//var child = 0;

module.exports = (_config) => {

	var config = _config;

	return {

		index: (request,response) => {

			//var urlObj = url.parse(`http://${request.url}`);

			views.getView('index',response,(data) => {
				response.end(data);
			});

			

		},

		streamFile: (request,response) => {
			
			var urlObj = url.parse(request.url, true);
			var query = urlObj.query;
			var vidName = query.name;
			var idx = query.index;
			var video = _videos[vidName];

			response.writeHead(200,{'Content-Type':'html'});
			
			if(!video) {
				exec("ffmpeg -i ./app/data/"+vidName+" -f mpeg1video http://localhost:4321/stream?name="+vidName, function (error, stdout, stderr) {
				  console.log('stdout: ' + stdout);
				  console.log('stderr: ' + stderr);
				  if (error !== null) {
				    console.log('exec error: ' + error);
				  }
				});
			}

			response.end("Start streaming "+vidName);
		},

		stream: (request,response) => {
			response.connection.setTimeout(0);
			var urlObj = url.parse(request.url, true);
			var query = urlObj.query;
			var vidName = query.name;
			//console.log(vidName);
			//console.log(request.mimeType);
			var body = [];
			request.on('data', function(chunk) {
			  body.push(chunk);
			}).on('end', function() {
			  	body = Buffer.concat(body).toString();
			  	_videos[vidName] = body;
			  	//console.log(_videos);
				//console.log("*******2");
			});



		}
	};



}

//ffmpeg -i Carousselle.mp4 -f mpeg1video http://localhost:4321/stream