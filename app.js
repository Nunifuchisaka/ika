var port = 3000;
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*
var routes = require('./routes/index');
var users = require('./routes/users');

app.use('/', routes);
app.use('/users', users);
*/


// routes setup
/*
var routes = require('./routes/index');
app.use('/', routes);
*/

app.use(express.static(path.join(__dirname, 'public')));

/*
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
*/

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

//
http.listen(port,function(){
  console.log("Expressサーバーがポート%dで起動しました。モード:%s",port,app.settings.env)
});


//module.exports = app;