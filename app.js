var _ = require('lodash');
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var partials = { header: 'header', footer: 'footer' };
var rooms = {};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res, next) {
  console.log('get: index');
  res.render('index', { title: 'CambriArms', partials: partials });
});


app.get('/room', function(req, res, next) {
  var newRoomName =  getNewRoomName();
  //console.log('keys', _.keys(rooms));
  res.redirect(302, newRoomName);
});


app.get('/:id', function(req, res, next) {
  //roomID = res.req.params.id;
  res.render('roulette', {
    title: 'ルーレット｜CambriArms',
    partials: partials,
    roomID: res.req.params.id
  });
});


io.on('connection', function(socket){
  console.log('connection', socket.id);
  var roomID = '';
  
  socket.on('c2s_connected', function(args){
    roomID = args.roomID;
    if(!rooms[roomID]) {
      rooms[roomID] = {
        //userCount: 0,
        attrs: null,
        players: null
      }
    }
    console.log('c2s_connected', roomID);
    //rooms[roomID].userCount++;
    //console.log(roomID, 'userCount', rooms[roomID].userCount);
    //io.sockets.emit('receive_players', rooms[roomID].players);
    socket.join(roomID);
    console.log('Joined: Room '+ roomID);
    io.to(roomID).emit('receive_players', rooms[roomID].players);
    io.to(roomID).emit('receive_attrs', rooms[roomID].attrs);
    //io.to(roomID).emit('receive_userCount', rooms[roomID].userCount);
  });
  
  socket.on('disconnect', function(){
    console.log('disconnect', socket.id);
    //rooms[roomID].userCount--;
    //if(0 > rooms[roomID].userCount) rooms[roomID].userCount = 0;
    //console.log(roomID, 'userCount', rooms[roomID].userCount);
  });
  
  socket.on('sync_attrs', function(_attrs){
    rooms[roomID].attrs = _attrs;
    //socket.broadcast.emit('receive_attrs', rooms[roomID].attrs);
    socket.broadcast.to(roomID).emit('receive_attrs', _attrs);
    //console.log('sync_attrs');
  });
  
  socket.on('sync_players', function(_players){
    rooms[roomID].players = _players;
    socket.broadcast.to(roomID).emit('receive_players', _players);
    //console.log('sync_players');
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});


function getNewRoomName() {
  var str = getRandomString();
  var keys = _.keys(rooms);
  var overlap = false;
  //console.log('keys', keys);
  _.each(keys, function(key){
    if(str == key){
      overlap = true;
      return false;
    }
  });
  if (!overlap) {
    return str;
  } else {
    console.log("重複しました。" + str);
    return getNewRoomName();
  }
}


function getRandomString() {
  var l = 8;
  //var l = 1;
  var c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  //var c = "ABC";
  var cl = c.length;
  var r = "";
  for(var i=0; i<l; i++){
    r += c[Math.floor(Math.random()*cl)];
  }
  return r;
}


/*
http.listen(3000, function(){
  console.log('listening on *:3000');
});
*/

// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/

/*
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
*/

// error handlers

// development error handler
// will print stacktrace
/*
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
*/

// production error handler
// no stacktraces leaked to user
/*
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/


module.exports = app;
