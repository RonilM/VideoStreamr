const fs = require('fs');

exports.getView = (path,response,cb) => {

	fs.readFile('app/Templates/'+path+'.html', 'utf8', function (err, data) {
		if (err) throw err;
		response.writeHead(200,{'Content-Type':'html'});
		cb.call(this,data);
	});

}