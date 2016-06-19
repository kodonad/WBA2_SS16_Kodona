var express = require('express');
var redis = require('redis');
var db = redis.createClient();

var audiobooks = new express.Router();


audiobooks.route('/')
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
             
            var newAudiobooks = req.body;
             db.incr('id:audiobooks', function(err,rep){
            newAudiobooks.id = rep;
        
            db.set('audiobooks:' + newUser.id, JSON.stringify(newUser), function(err,rep)
            {
             res.json(newAudiobooks);      
                   });
             });
       });
audiobooks.route('/:id')
    .get (function(req,res){
        
        db.get('audiobooks:'+req.params.id,function(err,rep){
            
            if(rep) {
                res.status(200).type('json').send(rep);
            }
            else {
                res.status(404).type('text').send('Das Hoerbuch mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    })

    .delete(function(req,res){
        
        db.del('audiobooks:'+req.params.id,function(err,rep){
            if(rep == 1)
                {
                    res.status(200).type('text').send('Erfolgreich das Hoerbuch mit der ID '+req.params.id+' gelöscht.')
                }
            else {
                res.status(404).type('text').send('Das Hoerbuch mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    })
    .put(function(req,res){
        db.exists('audiobooks:'+req.params.id, function(err,rep){
            if(rep == 1)
                {
                    var updatedAudiobooks = req.body;
                    updatedAudiobooks.id = req.params.id;
                    
                    db.set('audiobooks:'+req.params.id, JSON.stringify(updatedAudiobooks),function(err,rep){
                        res.json(updatedAudiobooks);
                    });
                }
            else
                {
                    res.status(404).type('text').send('Das Hoerbuch mit der ID ' +req.params.id+' existiert nicht');
                }
        });
    });

module.exports = audiobooks;