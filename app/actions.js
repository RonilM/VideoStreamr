module.exports = (_config) => {

	var config = _config;

	return {

		index: (request,response) => {

			//var urlObj = url.parse(`http://${request.url}`);
			response.end("Index");

		}


	}



}