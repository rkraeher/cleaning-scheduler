// we loop through entire workbook, separating 'availables' from till '{{date}}'
const DURATION_CODES = {
  Q: 30,
  D: 60,
  O: 120,
};

// this data will come from the spreadsheet
const availableRooms = {
  // room# is one column, room key is the next
  101: 'DBS',
  102: 'QDB',
  103: 'QDS',
  203: 'OC1',
  207: 'DDY',
  210: 'ODY',
  211: 'DBS',
  212: 'QDB',
  213: 'QDS',
  214: 'OC1',
  215: 'DDY',
  216: 'DDY',
};

const occupiedRooms = {
  // we just need room numbers, because all durations for occupied rooms will be 15
};

function getAvailableRooms() {
  let roomsMap = new Map();
  let totalDuration = 0;

  // availableRooms will come from spreadsheet
  for (const [room, durationCode] of Object.entries(availableRooms)) {
    roomsMap.set(room, durationCode[0]);
    totalDuration += DURATION_CODES[durationCode[0]];
  }

  return [roomsMap, totalDuration];
}

const [roomsMap, totalDuration] = getAvailableRooms();

function getRoomAssignments() {
  let cleanerA = new Map();
  cleanerA.set('durationForSingleCleaner', 0);

  let cleanerB = new Map();
  cleanerB.set('durationForSingleCleaner', 0);

  for (const [room, durationCode] of roomsMap) {
    const durationOfRoom = DURATION_CODES[durationCode];
    const isDurationForSingleCleanerLessThanOrEqualToHalfTheTotalDuration =
      cleanerA.get('durationForSingleCleaner') <
        Math.floor(totalDuration / 2) &&
      cleanerA.get('durationForSingleCleaner') + durationOfRoom <=
        Math.floor(totalDuration / 2);

    if (isDurationForSingleCleanerLessThanOrEqualToHalfTheTotalDuration) {
      cleanerA.set(room, durationOfRoom);

      cleanerA.set(
        'durationForSingleCleaner',
        cleanerA.get('durationForSingleCleaner') + durationOfRoom
      );
    }

    if (!cleanerA.has(room)) {
      cleanerB.set(room, durationOfRoom);
      cleanerB.set(
        'durationForSingleCleaner',
        cleanerB.get('durationForSingleCleaner') + durationOfRoom
      );
    }
  }

  return [cleanerA, cleanerB];
}

const [cleanerA, cleanerB] = getRoomAssignments();

console.log({ cleanerA, cleanerB });
