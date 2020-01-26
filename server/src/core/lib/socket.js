const socket = ({ app }) => {
  var http = require('http').createServer(app);
  var io = require('socket.io')(http);

  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('send', function(msg){
      console.log('message: ' + msg);
      io.emit('onsend', msg);
    });
  });

  return http;
}

module.exports = socket;