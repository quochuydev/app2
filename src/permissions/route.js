let path = require('path')
let { PermissionModel } = require(path.resolve('./src/permissions/model.js'))
const { _parse } = require(path.resolve('./src/core/lib/query'));

module.exports = ({ app }) => {
  app.route('/api/permissions')
    .get(async function (req, res, next) {
      let { criteria, limit, skip } = _parse(req.query);
      let permissions = await PermissionModel.find(criteria).limit(limit).skip(skip);
      res.json({ permissions });
    })
    .post(async function (req, res, next) {
      let data = req.body;
      let count_permissions = await PermissionModel._count({ code: data.code });
      if (count_permissions) {
        return next({ message: 'Mã quyền này đã tồn tại' })
      }
      let data_update = {
        code: data.code,
        name: data.name,
      }
      let permission = await PermissionModel._create(data_update);
      res.json({ permission });
    })
  app.route('/api/permissions/:id')
    .put(async function (req, res, next) {
      let permission_id = req.params.id;
      let data = req.body;
      let permission = await PermissionModel.findOneAndUpdate({ id: permission_id }, { $set: data }, { lean: true, new: true });
      res.json({ permission });
    })
    .delete(async function (req, res, next) {
      let permission_id = req.params.id;
      let permission = await PermissionModel.findOneAndUpdate({ id: permission_id }, { $set: { is_deleted: true } }, { lean: true, new: true });
      res.json({ error: false });
    })
}