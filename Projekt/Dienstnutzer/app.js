var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var ejs = require('ejs');
var fs = require('fs');
var http = require('http');

var users = require('./routes/users.js');
var books = require('./routes/books.js');
var ebooks = require('./routes/ebooks.js');
var audiobooks = require('./routes/audiobooks.js');
var libraries = require('./routes/libraries.js');

var app = express();

app.use(bodyParser.json());

app.use('/users',users);
app.use('/books',books);
app.use('/ebooks',ebooks);
app.use('/audiobooks',audiobooks);
app.use('/libraries',libraries);

app.route('/')
.get(jsonParser, function(req,res){
    fs.readFile('./routes/app.ejs',{encoding: 'utf-8'}, function(err,filestring){
        if(err){
            throw err;
        } else {
            
            var options = {
                host:'localhost',
                port: 3000,
                path: '/',
                method: 'GET',
                headers: {
                    accept: 'application/json'
                }
            }
            
            var externalRequest = http.request(options,function(externalResponse) {
                console.log('Connected');
                externalResponse.on('data', function(chunk) {
                    var appdata = chunk;
                    var html = ejs.render(filestring, appdata);
                    res.setHeader('content-type', 'text/html');
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            externalRequest.end();
        }
    });
});


app.listen(3001,function(){
    console.log("Server listens on Port 3001");
});

