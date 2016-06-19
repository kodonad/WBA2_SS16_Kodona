var express = require('express');
var redis = require('redis');
var db = redis.createClient();

var users = new express.Router();


users.route('/')
.get(function(req,res) {

        db.keys('users:*',function(err, rep){

        if(rep != 0){
                res.status(200).type('json').send(rep);
         }

            else {
                res.status(404).type('text').send('Es existieren keine Benutzer in der Datenbank');
                }
        });
    })

    .post(function(req,res){
             
            var newUser = req.body;
             db.incr('id:users', function(err,rep){
            newUser.id = rep;
        
            db.set('users:' + newUser.id, JSON.stringify(newUser), function(err,rep)
            {
             res.json(newUser);      
                   });
             });
       });
users.route('/:id')
    .get (function(req,res){
        
        db.get('users:'+req.params.id,function(err,rep){
            
            if(rep) {
                res.status(200).type('json').send(rep);
            }
            else {
                res.status(404).type('text').send('Der Benutzer mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    })

    .delete(function(req,res){
        
        db.del('users:'+req.params.id,function(err,rep){
            if(rep == 1)
                {
                    res.status(200).type('text').send('Erfolgreich den Benutzer mit der ID '+req.params.id+' gelöscht.')
                }
            else {
                res.status(404).type('text').send('Der Benutzer mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    })
    .put(function(req,res){
        db.exists('users:'+req.params.id, function(err,rep){
            if(rep == 1)
                {
                    var updatedUser = req.body;
                    updatedUser.id = req.params.id;
                    
                    db.set('users:'+req.params.id, JSON.stringify(updatedUser),function(err,rep){
                        res.json(updatedUser);
                    });
                }
            else
                {
                    res.status(404).type('text').send('Der Benutzer mit der ID ' +req.params.id+' existiert nicht');
                }
        });
    });
users.route('/:id/books/:id')

.get(function(req,res) {
    db.get('users:'+req.params.id,function(err,rep){
    if(rep) {
        res.status(200).type('json').send(rep);
    }
    else {
        res.status(404).type('text').send('Dieser Benutzer besitzt kein Buch mit der ID ' +req.params.id);
    }
    });
})
.post(function(req,res) {
    
    // Überprüfen ob es das Buch mit der ID 1 gibt und ob es verfügbar ist.
});   
module.exports = users;