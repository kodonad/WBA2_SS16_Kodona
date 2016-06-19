var express = require('express');
var redis = require('redis');
var db = redis.createClient();

var libraries = new express.Router();

libraries.route('/')
.get(function(req,res) {

        db.keys('libraries:*',function(err, rep){

        if(rep != 0){
                res.status(200).type('json').send(rep);
         }

            else {
                res.status(404).type('text').send('Es existieren keine Bibliotheken in der Datenbank');
                }
        });
    })
.post(function(req,res){
             
            var newLib = req.body;
             db.incr('id:libraries', function(err,rep){
            newLib.id = rep;
        
            db.set('libraries:' + newLib.id, JSON.stringify(newLib), function(err,rep)
            {
             res.json(newLib);      
                   });
             });
        });
libraries.route('/:id')
.get(function(req,res){
        
        db.get('libraries:'+req.params.id,function(err,rep){
            
            if(rep) {
                res.status(200).type('json').send(rep);
            }
            else {
                res.status(404).type('text').send('Die Bibliothek mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    })
.delete(function(req,res){
        
        db.del('libraries:'+req.params.id,function(err,rep){
            if(rep == 1)
                {
                    res.status(200).type('text').send('Erfolgreich die Bibliothek mit der ID '+req.params.id+' gelöscht.')
                }
            else {
                res.status(404).type('text').send('Die Bibliothek mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    });

module.exports = libraries;