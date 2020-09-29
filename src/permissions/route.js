let path = require('path')
let { PermissionModel } = require(path.resolve('./src/permissions/model.js'))
const { _parse } = require(path.resolve('./src/core/lib/query'));
let initData = require('./init_permission.json')

module.exports = ({ app }) => {
  app.route('/api/permissions')
    .get(async function (req, res, next) {
      let { criteria, limit, skip } = _parse(req.query);
      let result = { count: 0, permissions: [] }
      result.count = await PermissionModel.count(criteria);
      if (result.count) {
        result.permissions = await PermissionModel.find(criteria).limit(limit).skip(skip);
      }
      res.json(result);
    })
    .post(async function (req, res, next) {
      createPermission({ data: req.body })
        .then(result => res.json(result))
        .catch(error => next(error))

      async function createPermission({ data }) {
        if (!data.code) {
          throw { message: 'Vui lòng nhập mã code' }
        }
        if (!data.name) {
          throw { message: 'Vui lòng nhập tên nhóm' }
        }
        let count_permissions = await PermissionModel._count({ code: data.code });
        if (count_permissions) {
          throw { message: 'Mã quyền này đã tồn tại' }
        }
        let data_update = {
          code: data.code,
          name: data.name,
          note: data.note,
          is_full: data.is_full,
          roles: data.roles,
        }
        let permission = await PermissionModel._create(data_update);
        return { permission };
      }
    })
  app.route('/api/permissions/:id')
    .put(async function (req, res, next) {
      updatePermission({ permission_id: req.params.id, data: req.body })
        .then(result => res.json(result))
        .catch(error => next(error))

      async function updatePermission({ permission_id, data }) {
        if (!data.code) {
          throw { message: 'Vui lòng nhập mã code' }
        }
        if (!data.name) {
          throw { message: 'Vui lòng nhập tên nhóm' }
        }
        let count_permissions = await PermissionModel._count({ code: data.code, id: { $ne: permission_id } });
        if (count_permissions) {
          throw { message: 'Mã quyền này đã tồn tại' }
        }
        let data_update = {
          code: data.code,
          name: data.name,
          note: data.note,
          is_full: data.is_full,
          roles: data.roles,
        }
        let permission = await PermissionModel.findOneAndUpdate({ id: permission_id }, { $set: data_update }, { lean: true, new: true });
        return { permission }
      }
    })
    .delete(async function (req, res, next) {
      let permission_id = req.params.id;
      let permission = await PermissionModel.findOneAndUpdate({ id: permission_id }, { $set: { is_deleted: true } }, { lean: true, new: true });
      res.json({ error: false });
    })
}