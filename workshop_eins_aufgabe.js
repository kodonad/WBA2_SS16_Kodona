var fs = require ('fs');

var content;
fs.readFile(__dirname+"/wolkenkratzer.json",function read(err , data) {

if (err) {
	throw err;
	}

content = JSON.parse(data);

for(i = 0; i < content.wolkenkratzer.length; i++)
{
	console.log("\nName: "+content.wolkenkratzer[i].name);
	console.log("Stadt: "+content.wolkenkratzer[i].stadt);
	console.log("Höhe: "+content.wolkenkratzer[i].hoehe);
	console.log("\n------------------------------------");
}

});

