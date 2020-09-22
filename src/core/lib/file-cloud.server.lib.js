'use strict';

const API  = require('../api');
const fs   = require('fs');
const path = require('path');

async function generalUpload({ api, filePath, fileStream, fileName }) {
  if (!fileStream) {
    fileStream = fs.createReadStream(filePath);
  }
  if (!fileName) {
    fileName = path.basename(filePath);
  }
  fileName = fileName.replace(/ /g, '');

  return await API.call(api, { body : fileStream, params : { fileName }});
}

module.exports = {
  upload : ({ filePath, fileStream, fileName }) => generalUpload({ api : API.FILE_CLOUD.UPLOAD, filePath, fileStream, fileName }),
  import : ({ filePath, fileStream, fileName }) => generalUpload({ api : API.FILE_CLOUD.IMPORT, filePath, fileStream, fileName }),
  export : ({ filePath, fileStream, fileName }) => generalUpload({ api : API.FILE_CLOUD.EXPORT, filePath, fileStream, fileName }),
};

{ //------------------ TEST --------------------//

  const test = {
    async upload () {
      const assert = require('assert');
      const fse = require('fs-extra');
      const FileCloud = require(path.resolve('./modules/core/server/libs/file-cloud.server.lib.js'));

      const filePath = './hello.txt';
      const fileData = 'hello';

      await fse.writeFile(filePath, fileData);
      
      const link = await FileCloud.upload({ filePath });

      const { body } = await API.call({ method : 'get', url : link });

      assert.deepEqual(body, fileData);

      await fse.unlink(filePath);
    }
  };

  const path = require('path');
  const { _test } = require(path.resolve('./modules/core/server/libs/common.server.lib'));

  // _test(test);
}