var http = require("http");
var url = require("url");
var fs = require("fs"); 
var port = process.argv[2] || 8080;
 
var contentTypes = {
    'ico': 'image/x-icon',
    'html': 'text/html',
    'js': 'application/javascript',
    'json': 'application/json',
    'css': 'text/css',
    'jpg': 'image/png',
    'png': 'image/jpeg',
    'svg': 'image/svg+xml'
  };
 
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
 
http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = process.cwd() + uri;
    
    fs.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }
        
        if (fs.statSync(filename).isDirectory()) filename += '/index.html';
        
        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }
            
            var ext = filename.substr(filename.lastIndexOf('.') + 1);
            var contentType = contentTypes[ext] || "text/plain";
            
            response.writeHead(200, {"Content-Type": contentType});
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));
 
console.log("Static file server running at http://localhost:" + port + "/\n" +
            "CTRL + C to shutdown");