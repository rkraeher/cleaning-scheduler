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

function isNextYear(month) {
  const currentMonthIndex = new Date().getMonth();
  // JS Date months are zero indexed
  const monthIndex = month * 1 - 1;
  return currentMonthIndex === 11 && monthIndex === 0 ? true : false;
}

export function isOccupiedCleaningTime(date) {
  const [day, month] = date.split('.');

  const currentYear = new Date().getFullYear();

  // we check for the year-end edgecase
  const year = isNextYear(month) ? currentYear + 1 : currentYear;

  const dateString = `${month}/${day}/${year}`;
  const departureDate = new Date(dateString);

  const currentDate = new Date();

  const differenceInTime = Math.abs(
    departureDate.getTime() - currentDate.getTime()
  );
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays >= 2;
}

function parseAvailability(input = []) {
  // these will use the timeCode to set the cleaningTime
  let availableRooms = [];
  // these are all 15 min times
  let occupiedRooms = [];

  for (let row of input) {
    let dateString = row[2].split(' ')[1];
    const isRoomAvailable =
      row.includes('available') || !isOccupiedCleaningTime(dateString);

    if (isRoomAvailable) {
      availableRooms.push(row);
    } else {
      occupiedRooms.push(row);
    }
  }
  console.log({ availableRooms, occupiedRooms });
  return { availableRooms, occupiedRooms };
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
