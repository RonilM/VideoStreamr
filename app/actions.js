module.exports = (_config) => {

	var config = _config;

	return {

		index: (request,response) => {

			//var urlObj = url.parse(`http://${request.url}`);
			response.end("Index");

		},
		stream: (request,response) => {
			response.connection.setTimeout(0);

			var body = [];
			request.on('data', function(chunk) {
			  body.push(chunk);
			}).on('end', function() {
			  body = Buffer.concat(body).toString();
			  	console.log(body); //This is the video data
			});



		}
	}



}

//ffmpeg -i Carousselle.mp4 -f mpeg1video http://localhost:4321/stream