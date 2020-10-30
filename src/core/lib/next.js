const next = require('next');

module.exports = { Next }

function Next({ }) {
  const dev = process.env.NODE_ENV !== 'production';
  const appNext = next({ dev });
  const handle = appNext.getRequestHandler();
  appNext.prepare()
    .then(() => {

    })
    .catch(err => {
      console.log(err);
    })
}
