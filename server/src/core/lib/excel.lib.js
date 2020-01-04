const fse = require('fs-extra');
const path = require('path');
const ExcelJs = require('exceljs');

const ExcelLib = {
  loadFile: async ({ filePath, headers, emptyCellValue = undefined }) => {
    let buffer = await fse.readFile(filePath);
    let workbook = await new ExcelJs.Workbook().xlsx.load(buffer);
    let worksheet = workbook.getWorksheet(1);
    let lines = [];
    let rowOptions = { includeEmpty: false };
    let cellOptions = { includeEmpty: true };

    worksheet.eachRow(rowOptions, function (row) {
      let cells = [];

      row.eachCell(cellOptions, function (cell) {
        if (cell.value === null) {
          cell.value = emptyCellValue;
        }
        cells.push(cell.value);
      });

      lines.push(cells);
    });

    if (lines.length === 0) {

    }

    if (headers) {
      let actual_headers = lines[0];
      // TODO valid headers

      let rows = lines.slice(1);
      if (typeof headers[0] === 'object' && headers[0].key) {
        rows = rows.map(row => {
          const new_row = {};

          for (let i in headers) {
            let cell = row[i];
            if (cell && typeof cell === 'object' && cell.result) {
              cell = cell.result;
            }
            new_row[headers[i].key] = cell;
          }

          return new_row;
        })
      }
      lines = rows
    }

    return lines;
  },
  write: () => {

  }
}
module.exports = { ExcelLib }

const test = {
  load: async () => {
    try {
      let filePath = path.resolve('./files/test.xlsx');
      let headers = [
        { header: 'SKU', key: 'sku' },
        { header: 'Tên sản phẩm', key: 'name' },
        { header: 'Ngày tạo', key: 'created_at' },
        { header: 'Giá', key: 'price' },
      ]
      let data = await ExcelLib.loadFile({ filePath, headers })
      console.log(data)
    }
    catch (e) {
      console.log(e)
    }
  } 
}

const { _test } = require(path.resolve('./src/core/lib/_test'));
_test(test);