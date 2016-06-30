var express = require('express');
var redis = require('redis');
var db = redis.createClient();

var books = new express.Router();

books.route('/')
.get(function(req,res) {

        db.keys('audiobooks:*',function(err, rep){

        if(rep != 0){
                res.status(200).type('json').send(rep);
         }

            else {
                res.status(404).type('text').send('Es existieren keine Hoerbuecher in der Datenbank');
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
.get(function(req,res){
        
        db.get('audiobooks:'+req.params.isbn,function(err,rep){
            
            if(rep) {
                res.status(200).type('json').send(rep);
            }
            else {
                res.status(404).type('text').send('Das Hoerbuch mit der ISBN ' +req.params.isbn+' existiert nicht');
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