//var port = 3000;
var express = require('express');
var app = express();
//var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var router = express.Router();
var partials = { layout: "layout", header: "header", footer: "footer" };


console.log('routes/roulette.hjs');


router.get('/roulette/', function(req, res) {
  res.render('roulette_index', { title: 'ルーレット', partials: partials });
});

router.get('/roulette/:id(\\d+)', function(req, res) {
  //res.send('respond user Info userid:' + req.params.id);
  res.render('roulette_room', { title: 'ルーレット部屋', partials: partials });
});


var userCount = 0,
    attrs,
    players;

io.on('connection', function(socket){
  
  socket.on('connected', function(userAgent){
    //console.log('connected');
    userCount++;
    console.log('userCount', userCount);
    io.sockets.emit('receive_players', players);
    io.sockets.emit('receive_attrs', attrs);
    io.sockets.emit('receive_userCount', userCount);
  });
  
  socket.on('disconnect', function(){
    userCount--;
    if(0 > userCount) userCount = 0;
    console.log('userCount', userCount);
  });
  
  socket.on('sync_attrs', function(_attrs){
    attrs = _attrs;
    socket.broadcast.emit('receive_attrs', attrs);
    //console.log('sync_attrs');
  });
  
  socket.on('sync_players', function(_players){
    players = _players;
    socket.broadcast.emit('receive_players', players);
    //console.log('sync_players');
  });
});



module.exports = router;
