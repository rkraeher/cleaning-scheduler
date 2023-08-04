import React from 'react';
import { read, utils } from 'xlsx';

function FileUpload() {
  function isNumber(value) {
    if (typeof value === 'string') {
      return !Number.isNaN(Number(value));
    }
  }

  const parseRow = (row) => {
    // both these condition checks are highly specific to the usecase
    function isTimeCode(cell) {
      // matches D, Q, or O followed by either two capital letters or a capital letter and a number
      const regex = /^(D|Q|O)([A-Z]{2}|[A-Z]\d)$/;
      return regex.test(cell);
    }

    function isAvailability(cell) {
      // matches for available or till mm.dd. permits single or double digit day.month as well
      const regex = /^(available|till \d{1,2}\.\d{1,2})$/;
      return regex.test(cell);
    }

    let parsedRow = [];
    for (let i = 0; i < row.length; i++) {
      if (
        (row[i] && isNumber(row[i])) ||
        isTimeCode(row[i]) ||
        isAvailability(row[i])
      ) {
        parsedRow.push(row[i]);
      }
    }
    return parsedRow;
  };

  function parseRows(data) {
    let parsedRows = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] && isNumber(data[i][0])) {
        let parsedRow = parseRow(data[i]);
        parsedRows.push([...parsedRow]);
      }
    }
    return parsedRows;
  }

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet, {
      // API specific details: instead of getting an array of objects with '_EMPTY' as the property name for each cell,
      // by passing the opts argument here we can map every row into an array to make processing easier
      header: 1,
      defval: '',
    });
    const parsedData = parseRows(jsonData);
    console.log({ jsonData, parsedData });
  };
  return (
    <div>
      <input type="file" onChange={(e) => handleFile(e)} />
    </div>
  );
}

export default function App() {
  return (
    <div>
      <h1>Room Cleaning Planner</h1>
      <FileUpload />
    </div>
  );
}
