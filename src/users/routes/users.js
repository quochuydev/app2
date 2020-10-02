const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');

const UserModel = mongoose.model('User');

const config = require(path.resolve('./src/config/config'));
const { _parse } = require(path.resolve('./src/core/lib/query'));

const router = ({ app }) => {
  app.route('/api/users')
    .get(async function (req, res, next) {
      let { criteria, limit, skip } = _parse(req.query);
      let result = { count: 0, users: [] }
      result.count = await UserModel.count(criteria);
      if (result.count) {
        result.users = await UserModel.find(criteria).limit(limit).skip(skip);
      }
      res.json(result);
    })
    .post(async function (req, res, next) {
      let data = req.body;
      let count_user = await UserModel._count({ email: data.email });
      if (count_user) {
        return next({ message: 'Email đã tồn tại' })
      }
      let data_update = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        roles: data.roles,
      }
      let user = await UserModel._create(data_update);
      res.json({ user });
    })
  app.route('/api/users/:id')
    .get(async function (req, res, next) {
      let user_id = req.params.id;
      let result = { user: null }
      result.user = await UserModel.findOne({ id: user_id }).lean(true);
      res.json(result);
    })
    .put(async function (req, res, next) {
      let user_id = req.params.id;
      let data = req.body;
      let data_update = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        birthday: data.birthday,
        roles: data.roles,
      }
      let user = await UserModel.findOneAndUpdate({ id: user_id }, { $set: data_update }, { lean: true, new: true });
      res.json({ user });
    })
    .delete(async function (req, res, next) {
      let user_id = req.params.id;
      let user = await UserModel.findOneAndUpdate({ id: user_id }, { $set: { is_deleted: true } }, { lean: true, new: true });
      res.json({ error: false });
    })
}

module.exports = router;