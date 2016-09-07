var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var http = require('http');
var libraries = new express.Router();

libraries.route('/')
.get(jsonParser, function(req,res){
    fs.readFile('./routes/libejs/libraries.ejs',{encoding: 'utf-8'}, function(err,filestring){
        if(err){
            throw err;
        } else {
            
            var options = {
                host:'localhost',
                port: 3000,
                path: '/libraries',
                method: 'GET',
                headers: {
                    accept: 'application/json'
                }
            }
            
            var externalRequest = http.request(options,function(externalResponse) {
                console.log('Connected');
                externalResponse.on('data', function(chunk) {
                    console.log(JSON.parse(chunk));
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

libraries.route('/:id')
.get(bodyParser.json(), function(req, res){
fs.readFile('./routes/libejs/singlelib.ejs',{encoding: 'utf-8'}, function(err,filestring){
     if(err){
            throw err;
        } else {
    var libid = req.params.id;

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/libraries/'+libid,
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
libraries.route('/:id/books')
.get(bodyParser.json(), function(req, res){
fs.readFile('./routes/libejs/libbook.ejs',{encoding: 'utf-8'}, function(err,filestring){
     if(err){
            throw err;
        } else {
    var libid = req.params.id;

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/libraries/'+libid+'/books',
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
libraries.route('/:id/ebooks')
.get(bodyParser.json(), function(req, res){
fs.readFile('./routes/libejs/libebook.ejs',{encoding: 'utf-8'}, function(err,filestring){
     if(err){
            throw err;
        } else {
    var libid = req.params.id;

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/libraries/'+libid+'/ebooks',
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
libraries.route('/:id/audiobooks')
.get(bodyParser.json(), function(req, res){
fs.readFile('./routes/libejs/libaudiobook.ejs',{encoding: 'utf-8'}, function(err,filestring){
     if(err){
            throw err;
        } else {
    var libid = req.params.id;

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/libraries/'+libid+'/audiobooks',
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
module.exports = libraries;