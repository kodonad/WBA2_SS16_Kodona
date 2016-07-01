var express = require('express');
var redis = require('redis');
var db = redis.createClient();

var books = new express.Router();

books.route('/')
.get(function(req,res) {

        db.keys('books:*',function(err, rep){
        var books = [];
            
         if(rep.length != 0){
            db.mget(rep,function(err,rep){
                rep.forEach(function(val){
                    books.push(JSON.parse(val));
                });
                books = books.map(function(book){
                  return{isbn: book.isbn, titel: book.titel, subtitel: book.subtitel, author: book.author,erscheinungsjahr: book.erscheinungsjahr, anzahl: book.anzahl};  
                });
                var data = {library: books}
                res.json(data);
            });
        }
            else{
            var data = {library: books}
                res.json(data);
        }
        
        });
    })
.post(function(req,res){
             
            var newBook = req.body;
            db.set('books:' + newBook.isbn, JSON.stringify(newBook), function(err,rep)
            {
             res.json(newBook);      
                   });
        });
books.route('/:isbn')
    .get (function(req,res){
        
        db.get('books:'+req.params.isbn,function(err,rep){
            var getBook = [];
            if(rep) {
                getBook.push(JSON.parse(rep));
                
                getBook = getBook.map(function(book){
                    return{isbn: book.isbn, titel: book.titel, subtitel: book.subtitel, author: book.author,erscheinungsjahr: book.erscheinungsjahr, anzahl: book.anzahl};
                });
                var data = {library: getBook}
                res.json(data);
            }
            else {
                res.status(404).type('text').send('Das Buch mit der ID ' +req.params.isbn+' existiert nicht');
            }
        });
    })
.delete(function(req,res){
        
        db.del('books:'+req.params.isbn,function(err,rep){
            if(rep == 1)
                {
                    res.status(200).type('text').send('Erfolgreich das Buch mit der ISBN '+req.params.isbn+' gelöscht.')
                }
            else {
                res.status(404).type('text').send('Das Buch mit der ISBN ' +req.params.isbn+' existiert nicht');
            }
        });
    });

module.exports = books;