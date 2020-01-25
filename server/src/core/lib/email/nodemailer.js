var nodemailer = require('nodemailer'); // khai báo sử dụng module nodemailer
function send(req, res) {
  var transporter = nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
      user: '',
      pass: ''
    }
  });
  var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
    from: 'Thanh Batmon',
    to: 'quochuy.dev@gmail.com',
    subject: 'Test Nodemailer',
    text: 'You recieved message from ' + req.body.email,
    html: '<p>You have got a new message</b><ul><li>Username:' + req.body.name + '</li><li>Email:' + req.body.email + '</li><li>Username:' + req.body.message + '</li></ul>'
  }
  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
}

let req = {
  body: {
    email: 'quochuy.dev@gmail.com',
    name: 'Phạm Quốc Huy',
    message: 'Đây là mail!'
  }
}
// send(req)
module.exports = send;