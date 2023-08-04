import React, { useCallback, useEffect, useState } from 'react';
import { read, utils, writeFileXLSX } from 'xlsx';

function FileUpload() {
  function isNumber(value) {
    if (typeof value === 'string') {
      return !isNaN(value);
    }
  }

  const parseData = (data) => {
    let parsedRows = [];
    for (let i = 0; i < data.length; i++) {
      console.log(data[i][0], isNumber(data[i][0]));
      if (data[i][0] && isNumber(data[i][0])) {
        parsedRows.push([...data[i]]);
        i++;
      }
    }
    console.log({ parsedRows });
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    // const workbook = read(data, { sheetRows: 6 });
    const workbook = read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
    });

    const parsedData = parseData(jsonData);
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
