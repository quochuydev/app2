const socket = ({ app, config }) => {
  let http = require('http').createServer(app);

  if (config.socket.active) {
    let io = require('socket.io')(http);
    io.on('connection', function (socket) {
      socket.on('disconnect', function () {
        console.log('user disconnected');
      });
      socket.on('send', function (msg) {
        console.log('message: ' + msg);
        io.emit('onsend', msg);
      });
    });
  }

  return http;
}

module.exports = socket;