const MSG = (code, data) => {
  let messages = {
    ['MS-001']: '[abc] Messenger 1',
    ['MS-01']: '[abc] [xyz] [test]',
  }
  function compile(message, data) {
    if (!(data && typeof data === 'object')) {
      return message;
    }
    let matchingPattern = (/\[.+?\]/g);
    let result = message.toString ? message.toString() : '';
    result = result.replace(matchingPattern, (matcher) => {
      var path = matcher.slice(1, -1).trim();
      if (data[path]) return data[path]
      return matcher;
    });
    return result;
  }

  function has(code) {
    return messages.hasOwnProperty(code);
  }

  if (!has(code)) {
    return '';
  }

  message = messages[code];

  if (data) {
    return compile(message, data);
  }

  return message;
}

if (typeof module === 'object' && module.exports) {
  module.exports = MSG;
}
else if (typeof window === 'object') {
  window['MSG'] = MSG;
}

const test = () => {
  let reponse = {};
  reponse.a = MSG('MS-001', { abc: 'test abc' });
  reponse.b = MSG('MS-01', { abc: 'test abc', xyz: 'xyz' });
  reponse.c = MSG('MS-02');
  console.log(reponse);
  // { a: 'test abc Messenger 1', b: 'test abc xyz undefined', c: '' }
}
// test()