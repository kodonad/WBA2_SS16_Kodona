var express = require('express');
var redis = require('redis');
var db = redis.createClient();
var libraries = new express.Router();
var checkIndex;

// USER RESOURCE 
//
libraries.route('/')
.get(function(req,res) {

        db.keys('libraries:*',function(err, rep){
        var GetLib = [];
        if(rep.length == 0) {
            res.json(GetLib);
            return;
        }
        else{
            db.mget(rep,function(err,rep){
                rep.forEach(function(val){
                    GetLib.push(JSON.parse(val));
                });
                GetLib = GetLib.map(function(lib){
                  return{id: lib.id, name: lib.name};  
                });
                var data = {library: GetLib}
                res.json(data);
            });
        }
        
        });
    })

    .post(function(req,res){
             
            var newLib = req.body;
            db.incr('id:libraries', function(err,rep){
            newLib.id = rep;
            console.log(newLib);
            db.set('libraries:' + newLib.id, JSON.stringify(newLib), function(err,rep)
            {
             res.json(newLib);      
                   });
             });
       });
libraries.route('/:id')
    .get (function(req,res){
        
        db.get('libraries:'+req.params.id,function(err,rep){
            var getLib = [];
            if(rep) {
                getLib.push(JSON.parse(rep));
                
                getLib = getLib.map(function(library){
                    return{id: library.id, name: library.name};
                });
                var data = {library: getLib}
                res.json(data);
            }
            else {
                res.status(404).type('text').send('Die Bibliothek mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    })

    .delete(function(req,res){
        
        db.del('lbraries:'+req.params.id,function(err,rep){
            if(rep == 1)
                {
                    res.status(200).type('text').send('Erfolgreich die  Bibliothek mit der ID '+req.params.id+' gelöscht.')
                }
            else {
                res.status(404).type('text').send('die Bibliothek mit der ID ' +req.params.id+' existiert nicht');
            }
        });
    });
// libraries BOOKS
libraries.route('/:id/books')

.get(function(req,res) {
    db.exists('libraries:'+req.params.id,function(err,rep){
    if(rep == 1)
    {
    db.lrange('libraries:'+req.params.id+':books',0,10000,function(err,rep){
    var getBooks = [];
    if(rep != "") {
        
         rep.forEach(function(val){
                    getBooks.push(JSON.parse(val));
                });
        
               getBooks = getBooks.map(function(book){
                  return{isbn: book.isbn, titel: book.titel, subtitel: book.subtitel,
                        autor: book.autor, erscheinungsjahr: book.erscheinungsjahr};  
                });
       
        //console.log(getUserLoan);
                var data = {library: getBooks}
                res.json(data);
        }
         else {
             var data ={library: getBooks}
        res.json(data);
        }
    });
    }
    else { res.status(404).type('text').send('die Bibliothek mit der ID '+req.params.id+' existiert nicht.')
         }
});
})
.post(function(req,res) {
    
    db.exists('libraries:'+req.params.id,function(err,rep){
    if(rep==1)
    {
    var newBook = req.body;
    db.exists('books:'+newBook.isbn,function(err,rep){
    if(rep==1){
    
        var items = new Array;
        var parseditem;
        var checkIndex = false;
        var returnItem;
        db.llen("libraries:"+req.params.id+":books",function(err,rep){
        if(rep == 0)
                 {
                     db.lpush("libraries:"+req.params.id+":books",JSON.stringify(newBook),function(err,rep){
                                 res.status(200).type('text').send('Buch erfolreich erstellt.')
                             });
                 }
            else
            {

             db.lrange('libraries:'+req.params.id+':books',0,10000,function(err,rep){
                 items = rep;
                 if(rep != "") {
                 for(var i = 0; i <items.length ; i++)
                     {
                         //console.log(JSON.stringify(newLoan));
                         if(items[i].indexOf((JSON.stringify(newBook))) >= 0)
                             {
                                 checkIndex=true;
                                 returnItem = items[i];
                                 
                             }
                     }
                     if(checkIndex == false)
                         {
                             db.lpush("libraries:"+req.params.id+":books",JSON.stringify(newBook),function(err,rep){
                                 res.status(200).type('text').send('Buch erfolreich erstellt.')
                             });
                         }
                    else {
                        res.status(404).type('text').send('die Bibliothek mit der ID '+req.params.id+' hat bereits ein  Buch mit der ISBN '+req.body.isbn+' im Inventar.');
                    }
                 }
                    });
                }
             });

    }
    else { res.status(404).type('text').send('Das Buch mit der ISBN '+newLoan.isbn+' existiert nicht.')}
    });
    }
    else { res.status(404).type('text').send('die Bibliothek mit der ID '+req.params.id+' existiert nicht.!')}
    });
    
    
});
// libraries EBOOKS
libraries.route('/:id/ebooks')

.get(function(req,res) {
    db.exists('libraries:'+req.params.id,function(err,rep){
    if(rep == 1)
    {
    db.lrange('libraries:'+req.params.id+':ebooks',0,10000,function(err,rep){
    var getEBook = [];
    if(rep != "") {
        
         rep.forEach(function(val){
                    getEBook.push(JSON.parse(val));
                });
        
               getEBook = getEBook.map(function(ebook){
                  return{isbn: ebook.isbn, titel: ebook.titel, subtitel: ebook.subtitel,
                        autor: ebook.autor, erscheinungsjahr: ebook.erscheinungsjahr};  
                });
                var data = {library: getEBook}
                res.json(data);
        }
         else {
             var data ={library: getEBook}
        res.json(data);
        }
    });
    }
    else { res.status(404).type('text').send('die Bibliothek mit der ID '+req.params.id+' existiert nicht.')
         }
});
})
.post(function(req,res) {
    
    db.exists('libraries:'+req.params.id,function(err,rep){
    if(rep==1)
    {
    var newBook = req.body;
    db.exists('ebooks:'+newBook.isbn,function(err,rep){
    if(rep==1){
    
        var items = new Array;
        var parseditem;
        var checkIndex = false;
        var returnItem;
        db.llen("libraries:"+req.params.id+":ebooks",function(err,rep){
        if(rep == 0)
                 {
                db.lpush("libraries:"+req.params.id+":ebooks",JSON.stringify(newBook),function(err,rep){
                                 res.status(200).type('text').send('Erstellung des E-Books war erfolgreich.')
                             });
                 }
            else
            {

             db.lrange('libraries:'+req.params.id+':ebooks',0,10000,function(err,rep){
                 items = rep;
                 if(rep != "") {
                 for(var i = 0; i <items.length ; i++)
                     {
                         //console.log(JSON.stringify(newLoan));
                         if(items[i].indexOf((JSON.stringify(newBook))) >= 0)
                             {
                                 checkIndex=true;
                                 returnItem = items[i];
                                 
                             }
                     }
                     if(checkIndex == false)
                         {
                             db.lpush("libraries:"+req.params.id+":ebooks",JSON.stringify(newBook),function(err,rep){
                                 res.status(200).type('text').send('Erstellung des E-Books war erfolgreich.')
                             });
                         }
                    else {
                        res.status(404).type('text').send('die Bibliothek mit der ID '+req.params.id+' hat bereits ein  E-Book mit der ISBN '+req.body.isbn+' im Inventar.');
                    }
                 }
                 });
            }
             });

    }
    else { res.status(404).type('text').send('Das E-Book mit der ISBN '+newBook.isbn+' existiert nicht.')}
    });
    }
    else { res.status(404).type('text').send('Die Bibliothek mit der ID '+req.params.id+' existiert nicht.')}
    });
    
    
});
// libraries AUDIOBOOKS
libraries.route('/:id/audiobooks')

.get(function(req,res) {
    db.exists('libraries:'+req.params.id,function(err,rep){
    if(rep == 1)
    {
    db.lrange('libraries:'+req.params.id+':audiobooks',0,10000,function(err,rep){
    var getBook = [];
    if(rep != "") {
        
         rep.forEach(function(val){
                    getBook.push(JSON.parse(val));
                });
        
               getBook = getBook.map(function(audiobook){
                  return{isbn: audiobook.isbn, titel: audiobook.titel, subtitel: audiobook.subtitel,
                        autor: audiobook.autor, erscheinungsjahr: audiobook.erscheinungsjahr};  
                });
                var data = {library: getBook}
                res.json(data);
        }
         else {
             var data ={library: getBook}
        res.json(data);
        }
    });
    }
    else { res.status(404).type('text').send('Die Bibliothek mit der ID '+req.params.id+' existiert nicht.')
         }
});
})
.post(function(req,res) {
    
    db.exists('libraries:'+req.params.id,function(err,rep){
        console.log(rep);
    if(rep==1)
    {
    var newBook = req.body;
    db.exists('audiobooks:'+newBook.isbn,function(err,rep){
        console.log(rep);
    if(rep==1){
    
        var items = new Array;
        var parseditem;
        var checkIndex = false;
        var returnItem;
        db.llen("libraries:"+req.params.id+":audiobooks",function(err,rep){
             if(rep == 0)
                 {
                     db.lpush("libraries:"+req.params.id+":audiobooks",JSON.stringify(newBook),function(err,rep){
                                 res.status(200).type('text').send('Erstellung des Hoerbuchs war erfolgreich.')
                             });
                 }
            else
            {
             db.lrange('libraries:'+req.params.id+':audiobooks',0,10000,function(err,rep){
                 items = rep;
                 if(rep != "") {
                 for(var i = 0; i < items.length ; i++)
                     {
                         //console.log(JSON.stringify(newLoan));
                         if(items[i].indexOf((JSON.stringify(newBook))) >= 0)
                             {
                                 checkIndex=true;
                                 returnItem = items[i];
                                 
                             }
                         
                     }
                     if(checkIndex == false)
                         {
                             db.lpush("libraries:"+req.params.id+":audiobooks",JSON.stringify(newBook),function(err,rep){
                                 res.status(200).type('text').send('Erstellung des Hoerbuchs war erfolgreich.')
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
    else { res.status(404).type('text').send('Das Hoerbuch mit der ISBN '+newBook.isbn+' existiert nicht.')}
    });
    }
    else { res.status(404).type('text').send('die Bibliothek mit der ID '+req.params.id+' existiert nicht.')}
    });
    
    
});
libraries.route('/:id/users')
.get(function(req,res) {
    db.exists('libraries:'+req.params.id,function(err,rep){
    if(rep == 1)
    {
    db.lrange('libraries:'+req.params.id+':users',0,10000,function(err,rep){
    var getUser = [];
    if(rep != "") {
        
         rep.forEach(function(val){
                    getUser.push(JSON.parse(val));
                });
        
               getUser = getUser.map(function(user){
                  return{isbn: user.isbn, titel: user.titel, subtitel: user.subtitel,
                        autor: user.autor, erscheinungsjahr: user.erscheinungsjahr};  
                });
       
        console.log(getUserLoan);
                var data = {library: getUser}
                res.json(data);
        }
         else {
             var data ={library: getUser}
        res.json(data);
        }
    });
    }
    else { res.status(404).type('text').send('die Bibliothek mit der ID '+req.params.id+' existiert nicht.')
         }
});
    })

.post(function(req,res) {
    
    db.exists('libraries:'+req.params.id,function(err,rep){
    if(rep==1)
    {
    var newUser = req.body;
    db.exists('users:'+NewUser.id,function(err,rep){
    if(rep==1){
    
        var items = new Array;
        var parseditem;
        var checkIndex = false;
        var returnItem;
        db.llen("libraries:"+req.params.id+":users",function(err,rep){
                          if(rep == 0)
                 {
                     db.lpush("libraries:"+req.params.id+":users",JSON.stringify(newBook),function(err,rep){
                                 res.status(200).type('text').send('Das Einschreiben des Users  war erfolgreich.')
                             });
                 }
            else
            {

             db.lrange('libraries:'+req.params.id+':users',0,10000,function(err,rep){
                 items = rep;
                 if(rep != "") {
                 for(var i = 0; i <items.length ; i++)
                     {
                         //console.log(JSON.stringify(newLoan));
                         if(items[i].indexOf((JSON.stringify(newUser))) >= 0)
                             {
                                 checkIndex=true;
                                 returnItem = items[i];
                                 
                             }
                     }
                     if(checkIndex == false)
                         {
                             db.lpush("user:"+req.params.id+":users",JSON.stringify(newUser),function(err,rep){
                                 res.status(200).type('text').send('Das Einschreiben des Users  war erfolgreich.')
                             });
                         }
                    else {
                        res.status(404).type('text').send('in Dieser Bibliothek befindet sich bereits ein User mit der ID:'+newUser.id);
                    }
                 }
                 });
            }
             });

    }
    else { res.status(404).type('text').send('Der User mit der ID '+newLoan.id+' existiert nicht.')}
    });
    }
    else { res.status(404).type('text').send('Die Bibliothek mit der ID '+req.params.id+' existiert nicht.')}
    });
    
    
});
/*
users.route('/:id')
    .get (function(req,res){
        
        db.get('libraries:'+req.params.id,function(err,rep){
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
*/

module.exports = libraries;