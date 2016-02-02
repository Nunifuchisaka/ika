var port = 3000;
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);


// ECT view engine setup
/*
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
*/

// routes setup
/*
var routes = require('./routes/index');
app.use('/', routes);
*/

app.use(express.static(path.join(__dirname, 'public')));


//
io.on('connection', function(socket){
  socket.on('send_message', function(text){
    io.sockets.emit('receive_message',text);
  });
  
  socket.on('send_data', function(data) {
    io.sockets.emit('receive_data', data);
  });
});

//
http.listen(port,function(){
  console.log("Expressサーバーがポート%dで起動しました。モード:%s",port,app.settings.env)
});


module.exports = app;
