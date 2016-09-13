var http = require('http');
var fs = require('fs');
var path = require('path');
var extName, uriStats, pathRequested;

var mimeTypes = {
					"extension": "category/type",
					"html" 	: "text/html",
					"txt" 	: "text/plain",
					"css" 	: "text/css",
					"js"	: "text/javascript",
					"jpg"	: "image/jpg",
					"png"	: "image/png",
					"ico"	: "image/x-icon",
					"json"	: "application/json",
					"ttf"	: "application/x-font-ttf",
					"woff"	: "application/x-font-woff",
					"woff2"	: "application/font-woff2"
				};

function requestHandler(request, response)
{
		if(request.method=="POST")
		{
			console.log('There you go sweety, that\'s a POST request');
		}

		if(request.url == "/")
		{
			response.writeHead(200, {'Content-Type': 'text/html'});
			fs.createReadStream('index.html').pipe(response);
		}
		else
		{
			pathRequested = (request.url).substring(1, (request.url.length));
			try
			{
				uriStats = fs.statSync(pathRequested);
			}
			catch(e)
			{
				response.writeHead(404, {'Content-Type': 'text/html'});
				fs.createReadStream('error404.html').pipe(response);
				return;
			}

			
			if(uriStats.isFile())
			{
				extName = path.extname(pathRequested);
				extName = extName.substring(1, extName.length);
				extName = extName.toLowerCase();
				response.writeHead(200, {'Content-Type': mimeTypes[extName]});
				fs.createReadStream(pathRequested).pipe(response);
			}
			else if(uriStats.isDirectory())
			{

				if(pathRequested[(pathRequested.length)-1] == "/")
				{
					pathRequested = pathRequested.substring(0, (pathRequested.length)-1);
				}

				pathRequested+= "/index.html";

				try
				{
					uriStats = fs.statSync(pathRequested);
				}
				
				catch(e)
				{
					response.writeHead(404, {'Content-Type': 'text/html'});
					fs.createReadStream('error404.html').pipe(response);
					return;
				}

				extName = path.extname(pathRequested);
				extName = extName.substring(1, extName.length);
				extName = extName.toLowerCase();
				response.writeHead(200, {'Content-Type': mimeTypes[extName]});
				fs.createReadStream(pathRequested).pipe(response);
			}
		}



		

}



var port=Number(process.env.PORT || 3000);

http.createServer(requestHandler).listen(port);

console.log("The Server is running on the port " + port + " ...");