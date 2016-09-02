var http = require('http');
var fs = require('fs');

function requestHandler(request, response)
{
	response.writeHead(200, {'Content-Type': 'text/html'});
	fs.createReadStream('hidden.html').pipe(response);
}

var port=Number(process.env.PORT || 3000);

http.createServer(requestHandler).listen(port);