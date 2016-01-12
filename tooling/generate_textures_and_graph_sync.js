// TODO list only the files needed (files modified or not added since last sucessful run)
/*
find /home/web/benetou.fr/fabien/wiki.d/ -mtime 0
*/

// TODO make a graph of the entire wiki with relevant meta-data
// note that the format should be relevant to how we will use it later on
// e.g. easy to parse links from a page, etc

var fs = require('fs');
var MyDir = "/home/web/benetou.fr/fabien/wiki.d/";
var MyFile = "../MyWiki.js";

var wiki = {"Nodes" : {} };

var files = fs.readdirSync(MyDir);
for (file in files){
	var ignored = [".php",".flock",".zip",",del-",".pageindex",".stopwords",".htaccess", "totalcounter.stat", ".lastmod", ".exercisesscore"];
	var wrongfile=false;
	for (ignore in ignored){
		if (files[file].indexOf(ignored[ignore])>-1){
				wrongfile=true;
				}
	}
	if (wrongfile){ continue;}
	var filename = files[file];
	var fullpath = MyDir+files[file];

	var lines = fs.readFileSync(fullpath).toString().split('\n');
	var filenameparts = filename.split(".",2);
	var node = {Id: filename, Group: filenameparts[0], Label: filenameparts[1]} ;
	wiki.Nodes[filename] = node;

	for (line in lines) {
			var parts = lines[line].split("=",2);
			switch (parts[0]) {
			case "name":
				//console.log("name: ",parts[1]);
				node.Id = parts[1];
				break;
			case "rev":
				//console.log("rev: ",parts[1]);
				node.Rev = parseInt(parts[1]);
				break;
			case "ctime":
				//console.log("ctime: ",parts[1]);
				node.ChangeTime = parseInt(parts[1]);
				break;
			case "time":
				//console.log("time: ",parts[1]);
				break;
			case "targets":
				node.Targets = parts[1];
				if (parts[1]) {
					node.Targets = parts[1].split(",");
				}
				break;
			case "text":
				//console.log("text: ",parts[1]);
				//node.Text = parts[1];
				break;
			default:
				//console.log("unexpected data: ",parts[0]);
			}
	}
}
fs.writeFileSync(MyFile, JSON.stringify(wiki), 'utf-8', function(err) { });
