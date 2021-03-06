var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var db = redis.createClient();

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

app.listen(3000);
console.log('Server in Betrieb');

app.get('/', function(req, res) {
    res.send('Bibliothek Verleihsystem');
    });
