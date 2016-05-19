var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var app = express();

var buch = [
	
	{title: "REST in Practice",author: "Jim Webber",verlag: "O'REILLY",erscheinungsjahr: "2010",
	 ISBN: "978-0-596-80582-1"
	},
	
	{title: "Systemprogrammierung in UNIX/Linux",author: "Erich Ehses",verlag: "VIEWEG+TEUBNER",
	 erscheinungsjahr: "2011",ISBN: "978-3-8348-1418-0"
	}

	]
console.log ("Server in Betrieb");

app.get('/', function(req, res) {
	res.send('Willkommen zum Verleihsystem unserer Bibliothek');
	});

app.get('/buch', function(req,res){
	res.status(200).json(buch);
	});

app.post('/buch', function(req,res){
	buch.push(req.body);
	res.send("buch hinzugefügt");
	console.log(buch);
	});

app.listen(3000);

