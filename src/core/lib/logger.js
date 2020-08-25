const chalk = require('chalk');
const log = console.log;

function logger(dirname) {
  return write;
  function write(send) {
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
        log(dirname, chalk.green(result))
        break;
      case 'WARNING':
        log(dirname, chalk.yellow(result))
        break;
      case 'ERROR':
        log(dirname, chalk.red(result))
        break;
      default:
        log(dirname, result)
        break;
    }
    return;
  }
}

module.exports = logger;