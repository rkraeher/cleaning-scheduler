import React from 'react';
import { read, utils } from 'xlsx';

const roomStates = {
  DEPARTURE: 'departure',
  STAY: 'stay',
};

export function isNumberAsString(value) {
  if (typeof value === 'string' && value.trim() !== '') {
    return !Number.isNaN(Number(value));
  }
  return false;
}

export function parseRow(row) {
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
    const cell = row[i];
    const isCellRelevant =
      (cell && isNumberAsString(cell)) ||
      isTimeCode(cell) ||
      isAvailability(cell);

    if (isCellRelevant) {
      parsedRow.push(cell);
    }
  }
  return parsedRow;
}

export function parseRows(data) {
  // const is ok here?
  let parsedRows = [];
  for (let i = 0; i < data.length; i++) {
    // data[i][0] is roomNumber cell
    if (data[i][0] && isNumberAsString(data[i][0])) {
      // const?
      let parsedRow = parseRow(data[i]);
      parsedRows.push([...parsedRow]);
    }
  }
  return parsedRows;
}

// maybe move this declaration inside of isDeparture?
function isNextYear(month) {
  const currentMonthIndex = new Date().getMonth();
  // JS Date months are zero indexed
  const monthIndex = month * 1 - 1;
  return currentMonthIndex === 11 && monthIndex === 0 ? true : false;
}

function isDeparture(date) {
  const [day, month] = date.split('.');

  const currentYear = new Date().getFullYear();

  // we check for the year-end edgecase
  const year = isNextYear(month) ? currentYear + 1 : currentYear;

  const dateString = `${month}/${day}/${year}`;

  const departureDate = new Date(dateString);
  const currentDate = new Date();

  // weird behaviour when working with out of date. e.g., everything before today 15.8 is 'considered stay
  // consider removing Math.abs, and console.assert() that deparatureDate is after currentDate
  const differenceInTime = Math.abs(
    departureDate.getTime() - currentDate.getTime()
  );
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays < 2;
}

function parseAvailability(rooms = []) {
  for (let room of rooms) {
    let dateString = room[2].split(' ')[1];

    // room.includes('available') || isDeparture(dateString)
    //   ? room.push(roomStates.DEPARTURE)
    //   : room.push(roomStates.STAY);
    if (room.includes('available') || isDeparture(dateString)) {
      room.push(roomStates.DEPARTURE);
    } else {
      room.push(roomStates.STAY);
    }
  }

  return rooms;
}

// make FileUpload a separate component file
function FileUpload() {
  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet, {
      // API details: instead of getting an array of objects with '_EMPTY' as the property name for each cell,
      // by passing the options argument here we can map every row into an array to make processing easier
      header: 1,
      defval: '',
    });

    // perhaps all this processing should just be in its own functions
    // abstractions: 1) reading, parsing, and processing the file then 2) piping it into the script
    const parsedData = parseRows(jsonData);
    const parsedRooms = parseAvailability(parsedData);

    // pass parsedRooms to the script for balancing
  };
  return (
    <div>
      {/* should only upload xlsx files? or handle csvs too? */}
      {/* can it just but written onChange={handleFile} ? */}
      <input type="file" onChange={(e) => handleFile(e)} />
      {/* https://react.dev/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form */}
      {/* https://react.dev/learn/you-might-not-need-an-effect#caching-expensive-calculations */}
      {/* Give a name to every <input>, for example <input name="firstName" defaultValue="Taylor" />. 
      The name you specified will be used as a key in the form data, for example { firstName: "Taylor" }. */}
      {/* Probably want to add a submit button to make sure the uploaded file is the correct selection */}
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
