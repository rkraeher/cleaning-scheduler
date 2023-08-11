import React from 'react';
import { read, utils } from 'xlsx';

// isNumberAsString?
export function isNumber(value) {
  if (typeof value === 'string' && value.trim() !== '') {
    return !Number.isNaN(Number(value));
  }
  return false;
}

export function parseRow(row) {
  // both these condition checks are highly specific to the usecase
  // we could combine them into a single condition, isRowRelevant
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
}

export function parseRows(data) {
  let parsedRows = [];
  // for later: use filter() instead of this loop
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] && isNumber(data[i][0])) {
      let parsedRow = parseRow(data[i]);
      parsedRows.push([...parsedRow]);
    }
  }
  return parsedRows;
}

// add tests
export function isOccupiedCleaningTime(dottedDateString) {
  const [day, month] = dottedDateString.split('.');

  // Get the current year to use as a placeholder
  // Add logic to account for end of the year
  const currentYear = new Date().getFullYear();

  const dateString = `${month}/${day}/${currentYear}`;
  const departureDate = new Date(dateString);

  const currentDate = new Date();

  const differenceInTime = Math.abs(
    departureDate.getTime() - currentDate.getTime()
  );
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
  console.log({ dateString, departureDate, differenceInDays });
  return differenceInDays >= 2;
}

// if includes 'available', use the time code
function parseAvailability(input = []) {
  // these will use the timeCode to set the cleaningTime

  let availableRooms = [];
  for (let row of input) {
    // magic str
    if (row.includes('available')) {
      availableRooms.push(row);
    } else {
      let dateString = row[2].split(' ')[1];
      console.log(isOccupiedCleaningTime(dateString));
    }
  }
  // console.log({ availableRooms });
  return availableRooms;
}

// make FileUpload a separate component
function FileUpload() {
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
    parseAvailability(parsedData);
    // console.log({ parsedData });
  };
  return (
    <div>
      {/* should only upload xlsx files? or handle csvs too? */}
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
