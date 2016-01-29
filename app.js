var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//app.use(express.static('htdocs'));
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  socket.on('send_message', function(text){
    io.sockets.emit('receive_message',text);
  });
  
  socket.on('send_data', function(data) {
    io.sockets.emit('receive_data', data);
  });
});

var port = 3000;
http.listen(port,function(){
  console.log("Expressサーバーがポート%dで起動しました。モード:%s",port,app.settings.env)
});