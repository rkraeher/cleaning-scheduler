import { useState, useCallback } from 'react';
import { utils, writeFileXLSX } from 'xlsx';
import { getBalancedRoomLists } from '../getBalancedRoomLists';
import {
  addAvailabilityStatusToRooms,
  convertToJson,
  parseRows,
  validateRoomsData,
} from './importUtils';
import { Button as DownloadButton } from 'react95';
import * as S from './FileImportExport.styles';

export function FileImportExport() {
  const [roomsA, setRoomsA] = useState({});
  const [roomsB, setRoomsB] = useState({});
  const [allRooms, setAllRooms] = useState({});
  const [uploadedFileName, setUploadedFileName] = useState('');

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
          'Celkem:',
          totalCleaningTime,
          'Pobyty:',
          totalStaysCleaningTime,
          'Odjezdy:',
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
    setUploadedFileName(file.name);

    const jsonData = await convertToJson(file);
    const roomsData = addAvailabilityStatusToRooms(parseRows(jsonData));

    // TODO change alert to a UI embedded warning
    if (!validateRoomsData(roomsData)) {
      alert(
        'Careful! Your input data is missing some expected data. Script results may be inaccurate.'
      );
    }

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
    <S.Container>
      <section>
        <S.UploadButton htmlFor='upload'>Select File</S.UploadButton>

        <S.Text>
          {uploadedFileName ? (
            <span>{uploadedFileName}</span>
          ) : (
            <span>No file selected</span>
          )}
        </S.Text>

        <S.InvisibleInput
          id='upload'
          type='file'
          accept='.xls, .xlsx, .csv'
          onChange={importFile}
        />
      </section>

      <S.DownloadSection>
        <DownloadButton style={{ width: '50%' }} onClick={exportFile}>
          Download
        </DownloadButton>

        <S.Text>
          {allRooms?.rooms?.length > 0 ? (
            <span>rooms-list.xlsx</span>
          ) : (
            <span>... </span>
          )}
        </S.Text>
      </S.DownloadSection>
    </S.Container>
  );
}
