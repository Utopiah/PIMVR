var fs = require('fs');

var data = fs.readFileSync('./config.json'),
    myObj, configuration;

try {
	configuration = JSON.parse(data);
	console.dir(configuration);
}
catch (err) {
	console.log('There has been an error parsing your JSON.');
	console.log(err);
}

var stats = {};
var statsfile = './data/stats.json';
var data = fs.readFileSync(statsfile),
    myObj, stats;

try {
	stats = JSON.parse(data);
	console.dir(stats);
}
catch (err) {
	console.log('There has been an error parsing your JSON.');
	console.log(err);
}
//var data = fs.readFileSync(statsfile), stats;
//try { myObj = JSON.parse(data); console.dir(myObj); } catch (err) { console.log('There has been an error parsing your JSON.'); console.log(err); }

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({host:configuration.wsip, port:configuration.port});

wss.broadcast = function(data) {
  for (var i in this.clients)
    this.clients[i].send(data);
};

// use like this:
wss.on('connection', function(ws) {
  console.log('client connected');
  ws.on('message', function(message) {
	console.log('client sent message, sending it back to all other clients');
	console.log(message);
	wss.broadcast(message);
	// TODO somehow overwrites/loses previous content
	parsedmessage = JSON.parse(message);
	if ((parsedmessage.name) && (parsedmessage.action!="Viewer connected") && (parsedmessage.action!="Viewer disconnected")) {
	// on client opening page, offer JSON of moved pages
		console.log('stats before update', stats);
		if (stats[parsedmessage.name]){
			stats[parsedmessage.name]++;
		} else {
			stats[parsedmessage.name] = 1;
		}
		wss.broadcast(JSON.stringify({ViewUpdate: parsedmessage.name, value: stats[parsedmessage.name]}));
		// send back to the client which page has just been viewed
		console.log('increasing the scaling factor of ', parsedmessage.name, 'to ', stats[parsedmessage.name]);
		console.log('stats after update', stats);
	}
	if (parsedmessage.action == "Viewer disconnected"){
		console.log('stats before saving', stats);
		var data = JSON.stringify(stats);
		fs.writeFile(statsfile, data, function (err) {
				if (err) { console.log('There has been an error saving your stats data.'); console.log(err.message); return; }
				console.log('stats saved successfully.')
				});
	}
  });
});

process.stdin.on('data', function (data) {
	console.log('server sending message to all connected clients');
    wss.broadcast(data.toString());
});


wss.on('close', function() {
		console.log('client disconnected (close)');
		// somehow magically update this.clients
		// on client closing page, save position of moved pages
		});
