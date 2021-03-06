var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var http = require('http');
var users = new express.Router();
var server = http.createServer(users);

users.route('/')
.get(jsonParser, function(req,res){
    fs.readFile('./routes/usersejs/users.ejs',{encoding: 'utf-8'}, function(err,filestring){
        if(err){
            throw err;
        } else {
            
            var options = {
                host:'localhost',
                port: 3000,
                path: '/users',
                method: 'GET',
                headers: {
                    accept: 'application/json'
                }
            }
            
            var externalRequest = http.request(options,function(externalResponse) {
                console.log('Connected');
                externalResponse.on('data', function(chunk) {
                    var userdata = JSON.parse(chunk);
                    var html = ejs.render(filestring, userdata);
                    res.setHeader('content-type', 'text/html');
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            externalRequest.end();
        }
    });
});
users.route('/adduser')
.get(jsonParser, function(req,res){
    fs.readFile('./routes/usersejs/adduser.ejs',{encoding: 'utf-8'}, function(err,filestring){
        if(err){
            throw err;
        } else {
            
            var options = {
                host:'localhost',
                port: 3000,
                path: '/',
                method: 'GET',
                headers: {
                    accept: 'application/json'
                }
            }
var externalRequest = http.request(options,function(externalResponse) {
                console.log('Connected');
                externalResponse.on('data', function(chunk) {
                    var userdata = chunk;
                    var html = ejs.render(filestring, userdata);
                    res.setHeader('content-type', 'text/html');
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            externalRequest.end();
        }
    });
})
.post(function(req, res){
    
    var postData = JSON.stringify(req.body);
    
    var options = {
        host: 'localhost',
        port:3000,
        path: '/users/adduser',
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Cache-Control': 'no-cache',
        }
    };
    
    var req = http.request(options, function(response){
        response.on('data',function(chunk){
            console.log('Body: '+chunk,'Status: '+response.statusCode);
        });
    });
    req.on('error', function(e){
        console.log('Error, '+e.message);
    });
    
    // write data.
    
    req.write(postData);
    res.redirect('/users/');
    
//res.send('name: ' + req.body.name);
});

users.route('/:id')
.get(bodyParser.json(), function(req, res){
fs.readFile('./routes/usersejs/singleuser.ejs',{encoding: 'utf-8'}, function(err,filestring){
     if(err){
            throw err;
        } else {
    var userid = req.params.id;

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/users/'+userid,
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        };

        var externalRequest = http.request(options,function(externalResponse) {
                console.log('Connected');
                externalResponse.on('data', function(chunk) {
                    var userdata = JSON.parse(chunk);
                    var html = ejs.render(filestring,userdata);
                    res.setHeader('content-type', 'text/html');
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            externalRequest.end();
        }
  });
});


users.route('/:id/loanbooks')
.get(bodyParser.json(), function(req, res){
fs.readFile('./routes/usersejs/userloanbook.ejs',{encoding: 'utf-8'}, function(err,filestring){
     if(err){
            throw err;
        } else {
    var userid = req.params.id;

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/users/'+userid+'/loanbooks',
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        };

        var externalRequest = http.request(options,function(externalResponse) {
                console.log('Connected');
                externalResponse.on('data', function(chunk) {
                    var userdata = JSON.parse(chunk);
                    var html = ejs.render(filestring,userdata);
                    res.setHeader('content-type', 'text/html');
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            externalRequest.end();
        }
  });
});
users.route('/:id/loanebooks')
.get(bodyParser.json(), function(req, res){
fs.readFile('./routes/usersejs/userloanebook.ejs',{encoding: 'utf-8'}, function(err,filestring){
     if(err){
            throw err;
        } else {
    var userid = req.params.id;

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/users/'+userid+'/loanebooks',
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        };

        var externalRequest = http.request(options,function(externalResponse) {
                console.log('Connected');
                externalResponse.on('data', function(chunk) {
                    var userdata = JSON.parse(chunk);
                    var html = ejs.render(filestring,userdata);
                    res.setHeader('content-type', 'text/html');
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            externalRequest.end();
        }
  });
});
users.route('/:id/loanaudiobooks')
.get(bodyParser.json(), function(req, res){
fs.readFile('./routes/usersejs/userloanaudiobook.ejs',{encoding: 'utf-8'}, function(err,filestring){
     if(err){
            throw err;
        } else {
    var userid = req.params.id;

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/users/'+userid+'/loanaudiobooks',
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        };

        var externalRequest = http.request(options,function(externalResponse) {
                console.log('Connected');
                externalResponse.on('data', function(chunk) {
                    var userdata = JSON.parse(chunk);
                    var html = ejs.render(filestring,userdata);
                    res.setHeader('content-type', 'text/html');
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });
            externalRequest.end();
        }
  });
});
module.exports = users;