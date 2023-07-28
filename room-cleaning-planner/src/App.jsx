import React, { useCallback, useEffect, useState } from 'react';
import { read, utils, writeFileXLSX } from 'xlsx';

function FileUpload() {
  const handleUpload = () => {
    alert('File uploaded');
  };
  return (
    <div className="App">
      <form onSubmit={handleUpload}>
        <h1>Upload a file</h1>
        <input type="file" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default function App() {
  /* the component state is an array of presidents */
  const [pres, setPres] = useState([]);

  /* Fetch and update the state once */
  useEffect(() => {
    (async () => {
      const f = await // sample spreadsheet
      (await fetch('https://sheetjs.com/pres.xlsx')).arrayBuffer();
      const wb = read(f); // parse the array buffer
      const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
      const data = utils.sheet_to_json(ws); // generate objects
      setPres(data); // update state
    })();
  }, []);

  /* get state data and export to XLSX */
  const exportFile = useCallback(() => {
    const ws = utils.json_to_sheet(pres);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFileXLSX(wb, 'mySpreadSheet.xlsx');
  }, [pres]);

  async function handleFileAsync(e) {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = read(data);

    /* DO SOMETHING WITH workbook HERE */
  }

  return (
    <div>
      <h1>Room Cleaning Planner</h1>
      <table>
        <thead>
          <th>Name</th>
          <th>Index</th>
        </thead>
        <tbody>
          {
            /* generate row for each president */
            pres.map((pres) => (
              <tr>
                <td>{pres.Name}</td>
                <td>{pres.Index}</td>
              </tr>
            ))
          }
        </tbody>
        <td colSpan={2}>
          <button onClick={exportFile}>Export XLSX</button>
        </td>
      </table>
      <br />
      <FileUpload />
    </div>
  );
}
