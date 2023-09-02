import React, { useState } from 'react';
import { read, utils, writeFileXLSX } from 'xlsx';
import { getBalancedRoomLists, sumCleaningTime } from './getBalancedRoomLists';
import { roomStates } from './constants';
import { useCallback } from 'react';

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
  const parsedRows = [];

  for (let i = 0; i < data.length; i++) {
    const roomNumber = data[i][0];

    if (roomNumber && isNumberAsString(roomNumber)) {
      const parsedRow = parseRow(data[i]);
      parsedRows.push([...parsedRow]);
    }
  }
  return parsedRows;
}

function isDeparture(date) {
  const [day, month] = date.split('.');

  const currentYear = new Date().getFullYear();

  // we check for the year-end edgecase
  const year = isNextYear(month) ? currentYear + 1 : currentYear;

  const dateString = `${month}/${day}/${year}`;
  const departureDate = new Date(dateString);
  const currentDate = new Date();

  const differenceInTime = departureDate.getTime() - currentDate.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays < 2;

  function isNextYear(month) {
    const currentMonthIndex = new Date().getMonth();
    // JS Date months are zero indexed
    const monthIndex = month * 1 - 1;
    return currentMonthIndex === 11 && monthIndex === 0 ? true : false;
  }
}

function parseAvailability(rooms = []) {
  for (const room of rooms) {
    const dateString = room[2].split(' ')[1];

    room.includes('available') || isDeparture(dateString)
      ? room.push(roomStates.DEPARTURE)
      : room.push(roomStates.STAY);
  }

  return rooms;
}

function prepareRoomDataOutput(roomsData) {
  return roomsData.map((row) => {
    return {
      RoomNumber: row[0],
      Code: row[1],
      Date: row[2],
      Availability: row[3],
    };
  });
}

// make FileUpload a separate component file
function FileUpload() {
  const [allRooms, setAllRooms] = useState([]);
  const [roomsA, setRoomsA] = useState([]);
  const [roomsB, setRoomsB] = useState([]);

  // importFile
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
    const { roomsListA, roomsListB } = getBalancedRoomLists(parsedRooms);

    const allRoomsOutput = prepareRoomDataOutput(parsedRooms);

    const roomsOutputA = allRoomsOutput.filter((room) =>
      roomsListA.has(room.RoomNumber)
    );

    const roomsOutputB = allRoomsOutput.filter((room) =>
      roomsListB.has(room.RoomNumber)
    );

    // set the state
    setAllRooms(allRoomsOutput);
    setRoomsA(roomsOutputA);
    setRoomsB(roomsOutputB);
  };

  /* get state data and export to XLSX */
  const exportFile = useCallback(() => {
    const workbook = utils.book_new();

    // XLSX.utils.json_to_sheet takes an array of objects and returns a worksheet with
    // automatically-generated "headers" based on the keys of the objects.
    const allRoomsWorksheet = utils.json_to_sheet(allRooms);
    const roomsWorksheetA = utils.json_to_sheet(roomsA);
    const roomsWorksheetB = utils.json_to_sheet(roomsB);

    utils.book_append_sheet(workbook, allRoomsWorksheet, 'All Rooms');
    utils.book_append_sheet(workbook, roomsWorksheetA, 'Rooms List A');
    utils.book_append_sheet(workbook, roomsWorksheetB, 'Rooms List B');

    writeFileXLSX(workbook, 'room-lists.xlsx');
  }, [allRooms, roomsA, roomsB]);

  return (
    <div>
      {/* should only upload xlsx files? or handle csvs too? */}
      {/* can it just but written onChange={handleFile} ?
      should be wrapped in button */}
      <input type="file" onChange={(e) => handleFile(e)} />
      {/* https://react.dev/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form */}
      {/* https://react.dev/learn/you-might-not-need-an-effect#caching-expensive-calculations */}
      {/* Give a name to every <input>, for example <input name="firstName" defaultValue="Taylor" />. 
      The name you specified will be used as a key in the form data, for example { firstName: "Taylor" }. */}
      {/* Probably want to add a submit button to make sure the uploaded file is the correct selection */}
      <button onClick={exportFile}>Export XLSX</button>
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
