
var static = require('node-static');
var file = new(static.Server)('../');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    });
}).listen(process.env.PORT || 8000);

console.log('Listening on port', process.env.PORT||8000);
