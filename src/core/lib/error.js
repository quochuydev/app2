// const { ERR } = require(path.resolve('./src/core/lib/error.js'));

class ERR extends Error {
  constructor(props) {
    super();
    if (props) { Object.assign(this, props) }

    this.code = this.code || ERR.CODE;
  }
}

module.exports = { ERR }