var Flickr = require("flickrapi")
var uploadOptions = {
  photos: [{
    title: "test",
    tags: [
      "happy fox",
      "test 1"
    ],
    photo: __dirname + "/image/logo.jpg"
  }, {
    title: "test2",
    tags: "happy fox image \"test 2\" separate tags",
    photo: __dirname + "/test.jpg"
  }]
};

Flickr.authenticate(FlickrOptions, function (error, flickr) {
  Flickr.upload(uploadOptions, FlickrOptions, function (err, images) {
    if (err) {
      return console.error(err);
    }
    console.log("photos uploaded", images);
    for (const image of images) {
      flickr.photos.getInfo({
        photo_id: image
      }, function (error, result) {
        console.log(result.photo.urls.url[0]._content)
      })
    }
  });
})

// Flickr.authenticate(FlickrOptions, function (error, flickr) {
//   flickr.photos.getInfo({
//     photo_id: null
//   }, function (error, result) {
//     console.log(result.photo.urls.url[0]._content)
//   })
// })