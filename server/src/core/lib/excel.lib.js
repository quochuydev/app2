const fse = require('fs-extra');
const path = require('path');
const ExcelJs = require('exceljs');

const ExcelLib = {
  load: async () => {
    let filePath = path.resolve('./files/test.xlsx');
    let buffer = await fse.readFile(filePath);
    let workbook = await new ExcelJs.Workbook().xlsx.load(buffer);
    let worksheet = workbook.getWorksheet(1);
    console.log(worksheet)

  },
  write: () => {

  }
}
module.exports = { ExcelLib }

const test = async () => {
  console.log(await ExcelLib.load())
  //
}

test();