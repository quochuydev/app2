var amqp = require('amqplib/callback_api');

const eventBus = {
  config: { user: 'guest', pass: 'guest', host: 'localhost', port: '5672', vhost: 'qhdapp' },
  events: {
    order: {
      create: 'app.order.create'
    }
  },
  emit: (event, data) => {
    let { user, pass, host, port, vhost } = eventBus.config;
    var rabbitUrl = `amqp://${user}:${pass}@${host}:${port}/${vhost}?heartbeat=60`;
    amqp.connect([rabbitUrl], function (error, connection) {
      connection.createChannel(function (err, channel) {
        let queue = event;
        let msg = JSON.stringify(data)
        channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      })
      setTimeout(function () {
        connection.close();
      }, 500);
    })
  },
  on: (event) => {
    let { user, pass, host, port, vhost } = eventBus.config;
    var rabbitUrl = `amqp://${user}:${pass}@${host}:${port}/${vhost}?heartbeat=60`;
    amqp.connect([rabbitUrl], function (error, connection) {
      connection.createChannel(function (err, channel) {
        let queue = event;
        channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);
        channel.consume(queue, function (msg) {
          let data = msg.content.toString();
          console.log(data)
          channel.ack(msg);
        }, { noAck: false })
      })
    })
  },
  start: () => {
    eventBus.on(eventBus.events.order.create)
  },
}

module.exports = eventBus;

const test = () => {
  eventBus.emit(eventBus.events.order.create, { order: { id: '123' } })
}
test();