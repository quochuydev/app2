const chalk = require('chalk');
const log = console.log;

function logger(type, message) {
  message = JSON.stringify(message);
  switch (type) {
    case 'SUCCESS':
      log(chalk.green(message))
      break;
    case 'ERROR':
      log(chalk.red(message))
      break;
    case 'WARNING':
      log(chalk.yellow(message))
      break;
    default:
      log(message)
      break;
  }
  return;
}

module.exports = logger;