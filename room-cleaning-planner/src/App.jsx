import React from 'react';
import { read, utils } from 'xlsx';
import { CLEANING_TIMES_IN_MINUTES, roomStates } from './constants';

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
  let parsedRows = [];
  // for later: use filter() instead of this loop
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] && isNumberAsString(data[i][0])) {
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

function isDeparture(date) {
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

  return differenceInDays < 2;
}

function parseAvailability(rooms = []) {
  for (let room of rooms) {
    let dateString = room[2].split(' ')[1];

    if (room.includes('available') || isDeparture(dateString)) {
      room.push(roomStates.DEPARTURE);
    } else {
      room.push(roomStates.STAY);
    }
  }
  console.log({ rooms });
  return rooms;
}

// this works, but now we need to figure out how to import our script module
function setRoomsMap(rooms) {
  let roomsMap = new Map();

  for (const [roomNumber, cleaningTimeCode, , roomState] of rooms) {
    if (roomState === roomStates.STAY) {
      roomsMap.set(roomNumber, CLEANING_TIMES_IN_MINUTES['STAY']);
    } else {
      // only the first letter from the timeCodes cell is needed to set the cleaningTimeForOneRoom
      roomsMap.set(roomNumber, CLEANING_TIMES_IN_MINUTESf[cleaningTimeCode[0]]);
    }
  }
  console.log({ roomsMap });
  return roomsMap;
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
      // by passing the options argument here we can map every row into an array to make processing easier
      header: 1,
      defval: '',
    });
    const parsedData = parseRows(jsonData);
    const parsedRooms = parseAvailability(parsedData);
    setRoomsMap(parsedRooms);
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
