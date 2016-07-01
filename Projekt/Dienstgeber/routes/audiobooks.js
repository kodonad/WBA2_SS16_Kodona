var express = require('express');
var redis = require('redis');
var db = redis.createClient();

var books = new express.Router();

books.route('/')
.get(function(req,res) {
        db.keys('audiobooks:*',function(err, rep){
        var audiobooks = [];
        
        if(rep.length != 0){
            db.mget(rep,function(err,rep){
                rep.forEach(function(val){
                    audiobooks.push(JSON.parse(val));
                });
                audiobooks = audiobooks.map(function(audiobook){
                  return{isbn: audiobook.isbn, titel: audiobook.titel, subtitel: audiobook.subtitel, author: audiobook.author,erscheinungsjahr: audiobook.erscheinungsjahr, anzahl: audiobook.anzahl};  
                });
                var data = {library: audiobooks}
                res.json(data);
            });
        }
            else{
            var data = {library: audiobooks}
                res.json(data);
        }
        
        });
    })
.post(function(req,res){
             
            var newBook = req.body;
            db.set('audiobooks:' + newBook.isbn, JSON.stringify(newBook), function(err,rep)
            {
             res.json(newBook);      
                   });
        });
    
books.route('/:isbn')
    .get (function(req,res){
        
        db.get('audiobooks:'+req.params.isbn,function(err,rep){
            var getAudioBook = [];
            if(rep) {
                getAudioBook.push(JSON.parse(rep));
                
                getAudioBook = getAudioBook.map(function(audiobook){
                    return{isbn: audiobook.isbn, titel: audiobook.titel, subtitel: audiobook.titel, author: audiobook.author,erscheinungsjahr: audiobook.erscheinungsjahr, anzahl: audiobook.anzahl};
                });
                var data = {library: getAudioBook}
                res.json(data);
            }
            else {
                res.status(404).type('text').send('Das Hoerbuch mit der ID ' +req.params.isbn+' existiert nicht');
            }
        });
    })
.delete(function(req,res){
        
        db.del('audiobooks:'+req.params.isbn,function(err,rep){
            if(rep == 1)
                {
                    res.status(200).type('text').send('Erfolgreich das Hoerbuch mit der ISBN '+req.params.isbn+' gelöscht.')
                }
            else {
                res.status(404).type('text').send('Das Hoerbuch mit der ISBN ' +req.params.isbn+' existiert nicht');
            }
        });
    });

module.exports = books;