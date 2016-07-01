var express = require('express');
var redis = require('redis');
var db = redis.createClient();
var users = new express.Router();
var checkIndex;

// USER RESOURCE 
//
users.route('/')
.get(function(req,res) {

        db.keys('users:*',function(err, rep){
        var users = [];
        
        if(rep.length != 0){
            db.mget(rep,function(err,rep){
                rep.forEach(function(val){
                    users.push(JSON.parse(val));
                });
                users = users.map(function(user){
                  return{id: user.id, name: user.name};  
                });
                var data = {benutzer: users}
                res.json(data);
            });
        }
        else {
            var data = {benutzer: users}
                res.json(data);
        }
        });
    })

    .post(function(req,res){
             
            var newUser = req.body;
            console.log(newUser);
            db.incr('id:users', function(err,rep){
            newUser.id = rep;
            console.log(newUser);
            db.set('users:' + newUser.id, JSON.stringify(newUser), function(err,rep)
            {
             res.json(newUser);      
                   });
             });
       });
users.route('/:id')
    .get (function(req,res){
        
        db.get('users:'+req.params.id,function(err,rep){
            var getUser = [];
            if(rep) {
                getUser.push(JSON.parse(rep));
                
                getUser = getUser.map(function(user){
                    return{id: user.id, name: user.name};
                });
                var data = {benutzer: getUser}
                res.json(data);
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

// USER BOOKS
users.route('/:id/loanbooks')

.get(function(req,res) {
    db.exists('users:'+req.params.id,function(err,rep){
    if(rep == 1)
    {
    db.lrange('user:'+req.params.id+':loanbooks',0,10000,function(err,rep){
    var getUserLoan = [];
    if(rep != "") {
        
         rep.forEach(function(val){
                    getUserLoan.push(JSON.parse(val));
                });
        
               getUserLoan = getUserLoan.map(function(userloan){
                  return{isbn: userloan.isbn, titel: userloan.titel, subtitel: userloan.subtitel,
                        autor: userloan.autor, erscheinungsjahr: userloan.erscheinungsjahr};  
                });
       
        //console.log(getUserLoan);
                var data = {benutzer: getUserLoan}
                res.json(data);
        }
         else {
             var data ={benutzer: getUserLoan}
        res.json(data);
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
    
        var items = new Array;
        var parseditem;
        var checkIndex = false;
        var returnItem;
        db.llen("user:"+req.params.id+":loanbooks",function(err,rep){
        if(rep == 0)
                 {
                     db.lpush("user:"+req.params.id+":loanbooks",JSON.stringify(newLoan),function(err,rep){
                                 res.status(200).type('text').send('Die Ausleihe für den Benutzer mit der ID '+req.params.id+' war erfolgreich.')
                             });
                 }
            else
            {

             db.lrange('user:'+req.params.id+':loanbooks',0,10000,function(err,rep){
                 items = rep;
                 if(rep != "") {
                 for(var i = 0; i <items.length ; i++)
                     {
                         //console.log(JSON.stringify(newLoan));
                         if(items[i].indexOf((JSON.stringify(newLoan))) >= 0)
                             {
                                 checkIndex=true;
                                 returnItem = items[i];
                                 
                             }
                     }
                     if(checkIndex == false)
                         {
                             db.lpush("user:"+req.params.id+":loanbooks",JSON.stringify(newLoan),function(err,rep){
                                 res.status(200).type('text').send('Die Ausleihe für den Benutzer mit der ID '+req.params.id+' war erfolgreich.')
                             });
                         }
                    else {
                        res.status(404).type('text').send('Der Nutzer mit der ID '+req.params.id+' hat bereits ein  Buch mit der ISBN '+req.body.isbn+' ausgeliehen.');
                    }
                 }
                 });
            }
             });

    }
    else { res.status(404).type('text').send('Das Buch mit der ISBN '+newLoan.isbn+' existiert nicht. Ausleihe nicht moeglich!')}
    });
    }
    else { res.status(404).type('text').send('Der Nutzer mit der ID '+req.params.id+' existiert nicht. Ausleihe nicht moeglich!')}
    });
    
    
});
// USER EBOOKS
users.route('/:id/loanebooks')

.get(function(req,res) {
    db.exists('users:'+req.params.id,function(err,rep){
    if(rep == 1)
    {
    db.lrange('user:'+req.params.id+':loanebooks',0,10000,function(err,rep){
    var getUserLoan = [];
    if(rep != "") {
        
         rep.forEach(function(val){
                    getUserLoan.push(JSON.parse(val));
                });
        
               getUserLoan = getUserLoan.map(function(userloan){
                  return{isbn: userloan.isbn, titel: userloan.titel, subtitel: userloan.subtitel,
                        autor: userloan.autor, erscheinungsjahr: userloan.erscheinungsjahr};  
                });
       
        console.log(getUserLoan);
                var data = {benutzer: getUserLoan}
                res.json(data);
        }
         else {
             var data ={benutzer: getUserLoan}
        res.json(data);
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
    db.exists('ebooks:'+newLoan.isbn,function(err,rep){
    if(rep==1){
    
        var items = new Array;
        var parseditem;
        var checkIndex = false;
        var returnItem;
        db.llen("user:"+req.params.id+":loanebooks",function(err,rep){
                      if(rep == 0)
                 {
                     db.lpush("user:"+req.params.id+":loanebooks",JSON.stringify(newLoan),function(err,rep){
                                 res.status(200).type('text').send('Die Ausleihe für den Benutzer mit der ID '+req.params.id+' war erfolgreich.')
                             });
                 }
            else
            {

             db.lrange('user:'+req.params.id+':loanebooks',0,10000,function(err,rep){
                 items = rep;
                 if(rep != "") {
                 for(var i = 0; i <items.length ; i++)
                     {
                         //console.log(JSON.stringify(newLoan));
                         if(items[i].indexOf((JSON.stringify(newLoan))) >= 0)
                             {
                                 checkIndex=true;
                                 returnItem = items[i];
                                 
                             }
                     }
                     if(checkIndex == false)
                         {
                             db.lpush("user:"+req.params.id+":loanebooks",JSON.stringify(newLoan),function(err,rep){
                                 res.status(200).type('text').send('Die Ausleihe für den Benutzer mit der ID '+req.params.id+' war erfolgreich.')
                             });
                         }
                    else {
                        res.status(404).type('text').send('Der Nutzer mit der ID '+req.params.id+' hat bereits ein  E-Book mit der ISBN '+req.body.isbn+' ausgeliehen.');
                    }
                 }
                 });
            }
             });

    }
    else { res.status(404).type('text').send('Das E-Book mit der ISBN '+newLoan.isbn+' existiert nicht. Ausleihe nicht moeglich!')}
    });
    }
    else { res.status(404).type('text').send('Der Nutzer mit der ID '+req.params.id+' existiert nicht. Ausleihe nicht moeglich!')}
    });
    
    
});
// USER AUDIOBOOKS
users.route('/:id/loanaudiobooks')

.get(function(req,res) {
    db.exists('users:'+req.params.id,function(err,rep){
    if(rep == 1)
    {
    db.lrange('user:'+req.params.id+':loanaudiobooks',0,10000,function(err,rep){
    var getUserLoan = [];
    if(rep != "") {
        
         rep.forEach(function(val){
                    getUserLoan.push(JSON.parse(val));
                });
        
               getUserLoan = getUserLoan.map(function(userloan){
                  return{isbn: userloan.isbn, titel: userloan.titel, subtitel: userloan.subtitel,
                        autor: userloan.autor, erscheinungsjahr: userloan.erscheinungsjahr};  
                });
       
        console.log(getUserLoan);
                var data = {benutzer: getUserLoan}
                res.json(data);
        }
         else {
             var data ={benutzer: getUserLoan}
        res.json(data);
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
    db.exists('audiobooks:'+newLoan.isbn,function(err,rep){
    if(rep==1){
    
        var items = new Array;
        var parseditem;
        var checkIndex = false;
        var returnItem;
        db.llen("user:"+req.params.id+":loanaudiobooks",function(err,rep){
                      if(rep == 0)
                 {
                     db.lpush("user:"+req.params.id+":loanaudiobooks",JSON.stringify(newLoan),function(err,rep){
                                 res.status(200).type('text').send('Die Ausleihe für den Benutzer mit der ID '+req.params.id+' war erfolgreich.')
                             });
                 }
            else
            {


             db.lrange('user:'+req.params.id+':loanaudiobooks',0,10000,function(err,rep){
                 items = rep;
                 if(rep != "") {
                 for(var i = 0; i <items.length ; i++)
                     {
                         //console.log(JSON.stringify(newLoan));
                         if(items[i].indexOf((JSON.stringify(newLoan))) >= 0)
                             {
                                 checkIndex=true;
                                 returnItem = items[i];
                                 
                             }
                     }
                     if(checkIndex == false)
                         {
                             db.lpush("user:"+req.params.id+":loanaudiobooks",JSON.stringify(newLoan),function(err,rep){
                                 res.status(200).type('text').send('Die Ausleihe für den Benutzer mit der ID '+req.params.id+' war erfolgreich.')
                             });
                         }
                    else {
                        res.status(404).type('text').send('Der Nutzer mit der ID '+req.params.id+' hat bereits ein  Hoerbuch mit der ISBN '+req.body.isbn+' ausgeliehen.');
                    }
                 }
                 });
            }
             });

    }
    else { res.status(404).type('text').send('Das Hoerbuch mit der ISBN '+newLoan.isbn+' existiert nicht. Ausleihe nicht moeglich!')}
    });
    }
    else { res.status(404).type('text').send('Der Nutzer mit der ID '+req.params.id+' existiert nicht. Ausleihe nicht moeglich!')}
    });
    
    
});

module.exports = users;