var fs = require ('fs');

var content;
fs.readFile(__dirname+"/wolkenkratzer.json",function read(err , data) {

if (err) {
	throw err;
	}

content = JSON.parse(data); // Der Variabel content werden die ausgelesenen Informationen der Datei hinzugewiesen.
			   // Das Parse sorgt dafür, das die Informationen der Datei zu einem Objekt umgewandelt werden.

for(i = 0; i < content.wolkenkratzer.length; i++) // Die For-Schleife dient hier zur strukturierten Ausgabe des Objektes.
{
	console.log("\nName: "+content.wolkenkratzer[i].name);		// Beispiel:  Name : Burj Khalifa
	console.log("Stadt: "+content.wolkenkratzer[i].stadt);		//  	      Stadt: Dubai
	console.log("Höhe: "+content.wolkenkratzer[i].hoehe);		//	      Höhe : 828	
	console.log("\n------------------------------------");		//           -------------------------
}

});

