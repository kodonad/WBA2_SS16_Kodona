var express = require('express');
var redis = require('redis');
var db = redis.createClient();

var books = new express.Router();

books.route('/')
.get(function(req,res) {

        db.keys('ebooks:*',function(err, rep){
        var ebooks = [];
            
        if(rep.length != 0){
            db.mget(rep,function(err,rep){
                rep.forEach(function(val){
                    ebooks.push(JSON.parse(val));
                });
                ebooks = ebooks.map(function(ebook){
                  return{isbn: ebook.isbn, titel: ebook.titel, subtitel: ebook.subtitel, author: ebook.author,erscheinungsjahr: ebook.erscheinungsjahr, anzahl: ebook.anzahl};  
                });
                var data = {library: ebooks}
                res.json(data);
            });
        }
            else{
            var data = {library: ebooks}
                res.json(data);
        }
        
        });
    })
.post(function(req,res){
             
            var newBook = req.body;
            db.set('ebooks:' + newBook.isbn, JSON.stringify(newBook), function(err,rep)
            {
             res.json(newBook);      
                   });
        });
books.route('/:isbn')
    .get (function(req,res){
        
        db.get('ebooks:'+req.params.isbn,function(err,rep){
            var getEBook = [];
            if(rep) {
                getEBook.push(JSON.parse(rep));
                
                getEBook = getEBook.map(function(ebook){
                    return{isbn: ebook.isbn, titel: ebook.titel, subtitel: ebook.titel, author: ebook.author,erscheinungsjahr: ebook.erscheinungsjahr, anzahl: ebook.anzahl};
                });
                var data = {library: getEBook}
                res.json(data);
            }
            else {
                res.status(404).type('text').send('Das E-Book mit der ID ' +req.params.isbn+' existiert nicht');
            }
        });
    })
.delete(function(req,res){
        
        db.del('ebooks:'+req.params.isbn,function(err,rep){
            if(rep == 1)
                {
                    res.status(200).type('text').send('Erfolgreich das E-Book mit der ISBN '+req.params.isbn+' gelöscht.')
                }
            else {
                res.status(404).type('text').send('Das E-Book mit der ISBN ' +req.params.isbn+' existiert nicht');
            }
        });
    });

module.exports = books;