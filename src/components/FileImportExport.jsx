import { useState, useCallback } from 'react';
import { utils, writeFileXLSX } from 'xlsx';
import { getBalancedRoomLists } from '../getBalancedRoomLists';
import {
  addAvailabilityStatusToRooms,
  convertToJson,
  parseRows,
} from './importUtils';

export function FileImportExport() {
  const [roomsA, setRoomsA] = useState({});
  const [roomsB, setRoomsB] = useState({});
  const [allRooms, setAllRooms] = useState({});

  function appendCleaningTimesRow(worksheet, roomsList) {
    const {
      totalCleaningTime,
      totalStaysCleaningTime,
      totalDeparturesCleaningTime,
      rooms,
    } = roomsList;

    utils.sheet_add_aoa(
      worksheet,
      [
        [
          'Total Cleaning Time:',
          totalCleaningTime,
          'Total Stays:',
          totalStaysCleaningTime,
          'Total Departures:',
          totalDeparturesCleaningTime,
        ],
      ],
      {
        origin: rooms.length + 2,
      }
    );
  }

  const importFile = async (e) => {
    const file = e.target.files[0];
    const jsonData = await convertToJson(file);
    const roomsData = addAvailabilityStatusToRooms(parseRows(jsonData));

    // TODO here we should add some length validation to check that every row has every cell otherwise we should throw an error

    const { roomsListA, roomsListB, allRoomsList } =
      getBalancedRoomLists(roomsData);

    setRoomsA(roomsListA);
    setRoomsB(roomsListB);
    setAllRooms(allRoomsList);
  };

  const exportFile = useCallback(() => {
    const workbook = utils.book_new();

    const allRoomsWorksheet = utils.json_to_sheet(allRooms.rooms);
    const roomsWorksheetA = utils.json_to_sheet(roomsA.rooms);
    const roomsWorksheetB = utils.json_to_sheet(roomsB.rooms);

    appendCleaningTimesRow(allRoomsWorksheet, allRooms);
    appendCleaningTimesRow(roomsWorksheetA, roomsA);
    appendCleaningTimesRow(roomsWorksheetB, roomsB);

    utils.book_append_sheet(workbook, allRoomsWorksheet, 'All Rooms');
    utils.book_append_sheet(workbook, roomsWorksheetA, 'Rooms List A');
    utils.book_append_sheet(workbook, roomsWorksheetB, 'Rooms List B');

    writeFileXLSX(workbook, 'room-lists.xlsx');
  }, [roomsA, roomsB, allRooms]);

  return (
    <div>
      <input type='file' accept='.xls, .xlsx, .csv' onChange={importFile} />
      {allRooms?.rooms?.length > 0 && (
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
