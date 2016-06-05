    var express = require('express');
    var bodyParser = require('body-parser');
    var jsonParser = bodyParser.json();
    var redis = require('redis');
    var db = redis.createClient();

    var app = express();


    console.log ("Server in Betrieb");


    app.get('/', function(req, res) {
        res.send('Willkommen zum Verleihsystem unserer Bibliothek');
        });

/* User Methoden - GET,POST,DELETE,PUT (LISTE UND ID) */

    app.get('/users', function(req,res) {

        db.keys('users:*',function(err, rep){

        if(rep != 0){
                res.status(200).type('json').send(rep);
         }

            else {
                res.status(404).type('text').send('Es existieren keine Benutzer in der Datenbank');
                }
        });
    });

    app.post('/user', function(req,res){
             
            var newUser = req.body;
             db.incr('id:user', function(err,rep){
            newUser.id = rep;
        
            db.set('user:' + newUser.id, JSON.stringify(newUser), function(err,rep)
            {
             res.json(newUser);      
                   });
             });
        });
    
    app.get('/user/:id' , function(req,res){
        
        db.get('user:'+req.params.id,function(err,rep){
            
            if(rep) {
                res.status(200).type('json').send(rep);
            }
            else {
                res.status(404).type('text').send('Der Benutzer mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    });

    app.delete('/user/:id',function(req,res){
        
        db.del('user:'+req.params.id,function(err,rep){
            if(rep == 1)
                {
                    res.status(200).type('text').send('Erfolgreich den Benutzer mit der ID '+req.params.id+' gelöscht.')
                }
            else {
                res.status(404).type('text').send('Der Benutzer mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    });
    
    app.put('/user/:id',function(req,res){
        db.exists('user:'+req.params.id, function(err,rep){
            if(rep == 1)
                {
                    var updatedUser = req.body;
                    updatedUser.id = req.params.id;
                    
                    db.set('user:'+req.params.id, JSON.stringify(updatedUser),function(err,rep){
                        res.json(updatedUser);
                    });
                }
            else
                {
                    res.status(404).type('text').send('Der Benutzer mit der ID ' +req.params.id+' existiert nicht');
                }
        });
    });

/* Buch Methode - GET,POST,DELETE (LISTE UND ID) */

  app.get('/buecher', function(req,res) {

        db.keys('buecher:*',function(err, rep){

        if(rep != 0){
                res.status(200).type('json').send(rep);
         }

            else {
                res.status(404).type('text').send('Es existieren keine Buecher in der Datenbank');
                }
        });
    });


    app.post('/buch', function(req,res){
             
            var newBook = req.body;
             db.incr('id:buch', function(err,rep){
            newBook.id = rep;
        
            db.set('buch:' + newBook.id, JSON.stringify(newBook), function(err,rep)
            {
             res.json(newBook);      
                   });
             });
        });
    

    app.get('/buch/:id' , function(req,res){
        
        db.get('buch:'+req.params.id,function(err,rep){
            
            if(rep) {
                res.status(200).type('json').send(rep);
            }
            else {
                res.status(404).type('text').send('Das Buch mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    });

    app.delete('/buch/:id',function(req,res){
        
        db.del('buch:'+req.params.id,function(err,rep){
            if(rep == 1)
                {
                    res.status(200).type('text').send('Erfolgreich das Buch mit der ID '+req.params.id+' gelöscht.')
                }
            else {
                res.status(404).type('text').send('Das Buch mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    });

    app.listen(3000);

