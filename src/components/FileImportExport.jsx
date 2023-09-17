import React, { useState, useCallback } from 'react';
import { read, utils, writeFileXLSX } from 'xlsx';
import { roomStates } from '../constants';
import { getBalancedRoomLists } from '../getBalancedRoomLists';

export function isNumberAsString(value) {
  if (typeof value === 'string' && value.trim() !== '') {
    return !Number.isNaN(Number(value));
  }
  return false;
}

export function parseRow(row) {
  let parsedRow = [];
  for (let i = 0; i < row.length; i++) {
    let cell = row[i];

    if (typeof cell === 'string') cell = cell.trim();

    const isCellRelevant =
      (cell && isNumberAsString(cell)) ||
      isTimeCode(cell) ||
      isAvailability(cell);

    if (isCellRelevant) parsedRow.push(cell);
  }
  return parsedRow;

  function isTimeCode(cell) {
    // matches D, Q, or O followed by either two capital letters or a capital letter and a number
    const regex = /^(D|Q|O)([A-Z]{2}|[A-Z]\d)$/;
    return regex.test(cell);
  }

  function isAvailability(cell) {
    // matches for available or till mm.dd. in English and Czech
    // permits single or double digit day.month as
    const regexEnglish = /^(available|till \d{1,2}\.\d{1,2})$/;
    const regexCzech = /^(volný|volny|do \d{1,2}\.\d{1,2})$/;
    return regexCzech.test(cell) || regexEnglish.test(cell);
  }
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

async function convertToJson(file) {
  const data = await file.arrayBuffer();
  const workbook = read(data);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = utils.sheet_to_json(worksheet, {
    // xlsx details: instead of getting an array of objects with '_EMPTY' as the property name for each cell,
    // by passing the options argument here we can map every row into an array to make processing easier
    header: 1,
    defval: '',
  });

  return jsonData;
}

function addAvailabilityStatusToRooms(rooms = []) {
  for (const room of rooms) {
    const isRoomVacant =
      room.includes('available') ||
      room.includes('volný') ||
      room.includes('volny');

    const dateString = room[2].split(' ')[1];

    room.push(
      isRoomVacant
        ? roomStates.VACANT
        : isDeparture(dateString)
        ? roomStates.DEPARTURE
        : roomStates.STAY
    );
  }

  return rooms;

  function isDeparture(date) {
    const [day, month] = date.split('.');

    const currentYear = new Date().getFullYear();

    // we check for the year-end edgecase
    const year = isNextYear(month) ? currentYear + 1 : currentYear;

    const dateString = `${month}/${day}/${year}`;
    const departureDate = new Date(dateString);
    const currentDate = new Date();

    const differenceInTime = departureDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    // if the date is earlier than today than it should be an error
    return differenceInDays < 2;

    function isNextYear(month) {
      const currentMonthIndex = new Date().getMonth();
      // JS Date months are zero indexed
      const monthIndex = month * 1 - 1;
      return currentMonthIndex === 11 && monthIndex === 0 ? true : false;
    }
  }
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

export function FileImportExport() {
  const [allRooms, setAllRooms] = useState([]);
  const [roomsA, setRoomsA] = useState([]);
  const [roomsB, setRoomsB] = useState([]);

  const importFile = async (e) => {
    const file = e.target.files[0];
    const jsonData = await convertToJson(file);
    const roomsData = addAvailabilityStatusToRooms(parseRows(jsonData));

    const { roomsListA, roomsListB } = getBalancedRoomLists(roomsData);

    const allRoomsOutput = prepareRoomDataOutput(roomsData);
    const roomsOutputA = allRoomsOutput.filter((room) =>
      roomsListA.has(room.RoomNumber)
    );
    const roomsOutputB = allRoomsOutput.filter((room) =>
      roomsListB.has(room.RoomNumber)
    );

    setAllRooms(allRoomsOutput);
    setRoomsA(roomsOutputA);
    setRoomsB(roomsOutputB);
  };

  const exportFile = useCallback(() => {
    const workbook = utils.book_new();

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
      <input type="file" accept=".xls, .xlsx, .csv" onChange={importFile} />
      {allRooms.length > 0 && (
        <>
          <button onClick={exportFile}>Download</button>
          <p>
            <span>rooms-list.xlsx</span>
          </p>
        </>
      )}
    </div>
  );
}
