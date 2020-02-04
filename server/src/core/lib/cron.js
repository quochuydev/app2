var { CronJob } = require('cron');

const Cron = () => {
  var job1 = new CronJob('*/60 * * * * *', function () {
    console.log('You will see this message 60 second');
  });
  job1.start();
}

module.exports = Cron;