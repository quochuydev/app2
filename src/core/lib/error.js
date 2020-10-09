// const { ERR } = require(path.resolve('./src/core/lib/error.js'));

class ERR extends Error {
  constructor(props) {
    super();
    if (props) { Object.assign(this, props) }

    this.code = this.code || ERR.CODE;
  }
}

class ERR_SITE extends ERR {
  constructor(props) {
    super();
    if (props) { Object.assign(this, props) }

    this.code = 'SITE';
  }
}

module.exports = { ERR, ERR_SITE }