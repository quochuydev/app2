

let Controller = {};

Controller.create = async function ({ data }) {

  
  return { message: 'Tạo biến thể thành công' };
}

Controller.update = async function ({ variant_id, data }) {


  return { message: 'Cập nhật biến thể thành công' };
}

Controller.remove = async function ({ variant_id }) {

}

module.exports = Controller;