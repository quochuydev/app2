const chalk = require('chalk');
const log = console.log;

function logger(log) {
  let result;
  let { type, message, error } = log;
  if (typeof log == 'object') {
    result = JSON.stringify(message) || error;
  } else {
    result = log;
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