const chalk = require('chalk');
const log = console.log;

function logger(send) {
  let result;
  let { type, message, error } = send;
  if (typeof send == 'object') {
    result = JSON.stringify(message) || error;
  } else {
    result = send;
  }
  if (!type) { type = 'ERROR' }
  switch (type) {
    case 'SUCCESS':
      log(chalk.green(result))
      break;
    case 'WARNING':
      log(chalk.yellow(result))
      break;
    case 'ERROR':
      log(chalk.red(result))
      break;
    default:
      log(result)
      break;
  }
  return;
}

module.exports = logger;