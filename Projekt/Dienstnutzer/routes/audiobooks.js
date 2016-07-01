var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var http = require('http');
var audiobooks = new express.Router();

audiobooks.route('/')
.get(jsonParser, function(req,res){
    fs.readFile('./routes/audiobookejs/audiobooks.ejs',{encoding: 'utf-8'}, function(err,filestring){
        if(err){
            throw err;
        } else {
            
            var options = {
                host:'localhost',
                port: 3000,
                path: '/audiobooks',
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

audiobooks.route('/:id')
.get(jsonParser, function(req,res){
    fs.readFile('./routes/audiobookejs/singleaudiobook.ejs',{encoding: 'utf-8'}, function(err,filestring){
        if(err){
            throw err;
        } else {
            
            var options = {
                host:'localhost',
                port: 3000,
                path: '/books'+req.params.id,
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
module.exports = audiobooks;