var express = require('express');
var redis = require('redis');
var db = redis.createClient();
var users = new express.Router();
var checkIndex;

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
users.route('/:id/loanbooks')

.get(function(req,res) {
    db.exists('users:'+req.params.id,function(err,rep){
    if(rep==1)
    {
    db.lrange('users:'+req.params.id+':loanbooks',0,10000,function(err,rep){
    if(rep) {
        res.status(200).type('json').send(rep);
    }
    else {
        res.status(404).type('text').send('Dieser Benutzer hat keine Buecher ausgeliehen');
    }
    });
    }
    else { res.status(404).type('text').send('Der Nutzer mit der ID '+req.params.id+' existiert nicht.')
         }
});
})
.post(function(req,res) {
    
    db.exists('users:'+req.params.id,function(err,rep){
    if(rep==1)
    {
    var newLoan = req.body;
    db.exists('books:'+newLoan.isbn,function(err,rep){
    if(rep==1){
    db.lpush("users:"+req.params.id+":loanbooks",JSON.stringify(newLoan),function(err,rep){
       if(rep){
           res.status(200).type('text').send('Die Ausleihe für den Benutzer mit der ID '+req.params.id+' war erfolgreich.')
       }
    else {
            res.status(404).type('text').send('Der Benutzer mit der ID '+req.params.id+ 'existiert nicht.')
    }
    });
    }
    else { res.status(404).type('text').send('Das Buch mit der ISBN '+newLoan.isbn+' existiert nicht. Ausleihe nicht moeglich!')}
    });
    }
    else { res.status(404).type('text').send('Der Nutzer mit der ID '+req.params.id+' existiert nicht. Ausleihe nicht moeglich!')}
    });
});

users.route('/:id/loanbooks/:isbn')
.get(function(req,res){
     db.exists('users:'+req.params.id,function(err,rep){
    if(rep==1)
    {
        var items = new Array;
        var checkIndex = false;
        var returnItem;
             db.llen("users:"+req.params.id+":loanbooks",function(err,rep){
             var listLength = rep;

             db.lrange('users:'+req.params.id+':loanbooks',0,10000,function(err,rep){
                 items = rep;
                 for(var i = 0; i <items.length ; i++)
                     {
                         if(items[i].indexOf(req.params.isbn) > 0)
                             {
                                 checkIndex = true;
                                 returnItem = items[i];
                             }
                     }
                     if(checkIndex == true)
                         {
                             res.status(200).type('json').send(returnItem);
                         }
                    else {
                        res.status(404).type('text').send('Der Nutzer mit der ID '+req.params.id+' hat kein Buch mit der ISBN '+req.params.isbn+' ausgeliehen.');
                    }
                 });
             });
     }
    else {res.status(404).type('text').send('Der Nutzer mit der ID '+req.params.id+' existiert nicht.')
         }
        });
         
});

module.exports = users;