import { read, utils } from 'xlsx';
import { ROOM_STATES } from '../constants';

export function isRoomNumberAsString(value) {
  if (typeof value === 'string' && value.trim() !== '') {
    return !Number.isNaN(Number(value));
  }
  return false;
}

export function parseRow(row) {
  let parsedRow = [];
  for (const element of row) {
    let cell = element;

    if (typeof cell === 'string') cell = cell.trim();

    const isCellRelevant =
      (cell && isRoomNumberAsString(cell)) ||
      isCleanlinessStatus(cell) ||
      isTimeCode(cell) ||
      isAvailability(cell);

    if (isCellRelevant) parsedRow.push(cell);
  }
  return parsedRow;

  function isCleanlinessStatus(cell) {
    return cell.length === 1 && (cell === 'U' || cell === 'N');
    // if cell==='C' throw an error/warning about incorrect language
    // (make sure to upload doc in Czech, or you may get incorrect results)
    // should also handle the 'available' similarly
  }

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

  for (const element of data) {
    const roomNumber = element[0];

    if (roomNumber && isRoomNumberAsString(roomNumber)) {
      const parsedRow = parseRow(element);
      parsedRows.push([...parsedRow]);
    }
  }
  return parsedRows;
}

export async function convertToJson(file) {
  const data = await file.arrayBuffer();
  const workbook = read(data);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = utils.sheet_to_json(worksheet, {
    // xlsx: by passing an options argument here we can map every row into an array to make processing easier
    header: 1,
    defval: '',
  });

  return jsonData;
}

export function addAvailabilityStatusToRooms(rooms = []) {
  for (const room of rooms) room.push(getRoomState(room));

  return rooms;

  function getRoomState(room) {
    const isUncleanedLeftoverRoom = room.includes('N');

    const dateString = room[2].split(' ')[1];

    const isRoomVacant =
      room.includes('available') ||
      room.includes('volný') ||
      room.includes('volny');

    if (isUncleanedLeftoverRoom || (dateString && isDeparture(dateString))) {
      return ROOM_STATES.DEPARTURE;
    }

    if (isRoomVacant) {
      return ROOM_STATES.VACANT;
    } else {
      return ROOM_STATES.STAY;
    }
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
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    // TODO if the date is earlier than today than it should be an error
    return differenceInDays < 2;

    function isNextYear(month) {
      const currentMonthIndex = new Date().getMonth();
      // JS Date months are zero indexed
      const monthIndex = month * 1 - 1;
      return !!(currentMonthIndex === 11 && monthIndex === 0);
    }
  }
}
