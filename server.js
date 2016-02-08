var fs = require("fs");

var port = 9876;
var http = require("http");
var server = http.createServer();
server.on('request', request);
server.listen(port);
var stats = {};

var statsfile = './data/stats.json';
var data = fs.readFileSync(statsfile), stats;
try { myObj = JSON.parse(data); console.dir(myObj); } catch (err) { console.log('There has been an error parsing your JSON.'); console.log(err); }

function request(request, response) {
    var store = '';

    request.on('data', function(data) 
    {
        store += data;
	data = JSON.parse(data);
	if (data.name == "Page closed"){
		console.log('First connection assumed');
	} else {
		if (stats[data.name]){
			stats[data.name]++;
		} else {
			stats[data.name] = 1;
		}
		console.log('increasing the scaling factor of ', data.name, 'to ', stats[data.name]);
	}
    });
    request.on('end', function() 
    {  console.log(store);
        response.setHeader("Content-Type", "text/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
       	response.end(JSON.stringify(stats));
	//response.end(store)
var data = JSON.stringify(stats);
fs.writeFile(statsfile, data, function (err) {
		if (err) { console.log('There has been an error saving your stats data.'); console.log(err.message); return; }
		console.log('stats saved successfully.')
});

    });
}

// on client opening page, offer JSON of moved pages

// on client closing page, save position of moved pages
