import { read, utils } from 'xlsx';
import { ROOM_STATES } from '../../constants';

export function isRoomNumberAsString(value) {
  if (typeof value === 'string' && value.trim() !== '') {
    return !Number.isNaN(Number(value));
  }
  return false;
}

export function parseRow(row) {
  let parsedRow = [];
  let hasTimeCodeCell = false;
  for (const element of row) {
    let cell = element;

    if (typeof cell === 'string') cell = cell.trim();

    const isCellRelevant =
      (cell && isRoomNumberAsString(cell)) || isAvailability(cell);

    if (isTimeCode(cell) && !hasTimeCodeCell) {
      hasTimeCodeCell = true;
      parsedRow.push(cell);
    }

    if (isCellRelevant) parsedRow.push(cell);
  }
  return parsedRow;

  function isAvailability(cell) {
    // matches ${phrase} + dd.mm date format
    // permits single or double digit day.month as
    const regexCzech = /^(volný|volny|v o l n ý|do \d{1,2}\.\d{1,2})$/;
    return regexCzech.test(cell);
  }
}

export function isTimeCode(cell) {
  // matches D, Q, or O followed by either two capital letters or a capital letter and a number
  // it would be better to have a more precise regex to match against only known timeCodes, but there isn't enough provided info
  const regex = /^(D|Q|O)([A-Z]{2}|[A-Z]\d)$/;
  return regex.test(cell);
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
    const dateString = room[2].split(' ')[1];

    const isRoomVacant =
      room.includes('volný') ||
      room.includes('volny') ||
      room.includes('v o l n ý');

    if (dateString && isDeparture(dateString)) {
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

    return differenceInDays < 0
      ? alertOnceForSuspiciousDate()
      : 0 <= differenceInDays && differenceInDays < 2;

    function isNextYear(month) {
      const currentMonthIndex = new Date().getMonth();
      // JS Date months are zero indexed
      const monthIndex = month * 1 - 1;
      return !!(currentMonthIndex === 11 && monthIndex === 0);
    }
  }
}

function alertOnceForSuspiciousDate() {
  // it should just not print anything in this case, because the output data will be useless anyway
  alert(
    'Double check your input. Departure dates are earlier than current date. They will be recorded as "stays."'
  );
  // eslint-disable-next-line no-func-assign
  alertOnceForSuspiciousDate = () => false;
}

export function validateRoomsData(roomsData) {
  return roomsData.every((cell) => cell.length === 4);
}
