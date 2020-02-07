const path = require('path');
const { CronJob } = require('cron');
const { cron } = require(path.resolve('./src/config/config'));
const { job1 } = cron;

const Cron = () => {
  let job1Job = new CronJob(job1, function () {
    // console.log('You will see this message 60 second');
  });
  job1Job.start();
}

module.exports = Cron;