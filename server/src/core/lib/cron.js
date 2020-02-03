var { CronJob } = require('cron');

const Cron = () => {
  var job1 = new CronJob('*/10 * * * * *', function () {
    console.log('You will see this message 10 second');
  });
  job1.start();
}

module.exports = Cron;