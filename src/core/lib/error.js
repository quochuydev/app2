class ERR extends Errors {
  constructor(props) {
    super();
    if (props) { Object.assign(this, props) }

    this.code = this.code || ERR.CODE;
  }
}

module.exports = { ERR }