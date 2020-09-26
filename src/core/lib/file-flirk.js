// const { uploadToFlirk } = require(path.resolve('./src/core/lib/file-flirk.js'));

let Flickr = require("flickrapi")
const path = require('path');

const config = require(path.resolve('./src/config/config'));

async function uploadToFlirk({ file }) {
  return new Promise(function (resolve, reject) {
    let uploadOptions = {
      photos: [{
        title: `${file.filename}-${file.originalname}`,
        photo: file.path
      }]
    };
    Flickr.authenticate(config.flirk_options, function (error, flickr) {
      if (error) { throw error; }
      Flickr.upload(uploadOptions, config.flirk_options, function (err, images) {
        if (err) { throw error; }
        for (const image of images) {
          flickr.photos.getInfo({
            photo_id: image
          }, async function (error, result) {
            if (error) { throw error; }
            let content = result.photo.urls.url[0]._content;
            let { farm, server, id, secret } = result.photo
            let image_src = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`
            console.log(image_src)
            resolve(image_src);
          })
        }
      });
    })
  })
}

module.exports = { uploadToFlirk }