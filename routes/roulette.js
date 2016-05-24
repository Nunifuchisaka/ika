var express = require('express');
var router = express.Router();
var partials = { layout: 'layout', header: 'header', footer: 'footer' };
var app = express();
var io = require('socket.io')(app);

router.get('/', function(req, res, next) {
  console.log('get: roulette index');
  res.render('roulette_index', { title: 'ルーレット｜CambriArms', partials: partials });
});


router.get('/:id', function(req, res, next) {
  console.log('get: roulette room');
  res.render('roulette_room', { title: 'ルーレット｜CambriArms', partials: partials });
  
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
  
});

module.exports = router;
