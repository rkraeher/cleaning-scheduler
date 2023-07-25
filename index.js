// we loop through entire workbook, separating 'availables' from till '{{date}}'
export const CLEANING_TIME_IN_MINUTES = {
  D: 30,
  Q: 60,
  O: 120,
};

// this data will come from the spreadsheet
export const availableRooms = {
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

const roomsMap = setRoomsMap(availableRooms);

const totalCleaningTime = calculateTotalCleaningTime(
  roomsMap,
  CLEANING_TIME_IN_MINUTES
);

const [cleanerA, cleanerB] = getRoomAssignments(roomsMap);

export function setRoomsMap(availableRooms) {
  let roomsMap = new Map();

  for (const [room, cleaningTimeCode] of Object.entries(availableRooms)) {
    roomsMap.set(room, cleaningTimeCode[0]);
  }

  return roomsMap;
}

export function calculateTotalCleaningTime(roomsMap, CLEANING_TIMES) {
  let totalCleaningTime = 0;
  for (const cleaningTimeCode of roomsMap.values()) {
    totalCleaningTime += CLEANING_TIMES[cleaningTimeCode];
  }
  return totalCleaningTime;
}

export function getRoomAssignments(roomsMap) {
  const TOTAL_CLEANING_TIME_FOR_SINGLE_CLEANER =
    'totalCleaningTimeForSingleCleaner';

  let cleanerA = new Map();
  cleanerA.set(TOTAL_CLEANING_TIME_FOR_SINGLE_CLEANER, 0);

  let cleanerB = new Map();
  cleanerB.set(TOTAL_CLEANING_TIME_FOR_SINGLE_CLEANER, 0);

  function updateCleaner(cleaner, room, cleaningTimeForOneRoom) {
    cleaner.set(room, cleaningTimeForOneRoom);
    cleaner.set(
      TOTAL_CLEANING_TIME_FOR_SINGLE_CLEANER,
      cleaner.get(TOTAL_CLEANING_TIME_FOR_SINGLE_CLEANER) +
        cleaningTimeForOneRoom
    );
  }

  for (const [room, cleaningTimeCode] of roomsMap) {
    const cleaningTimeForOneRoom = CLEANING_TIME_IN_MINUTES[cleaningTimeCode];

    const IS_CLEANING_TIME_FIT_FOR_SINGLE_CLEANER =
      cleanerA.get(TOTAL_CLEANING_TIME_FOR_SINGLE_CLEANER) <
        Math.floor(totalCleaningTime / 2) &&
      cleanerA.get(TOTAL_CLEANING_TIME_FOR_SINGLE_CLEANER) +
        cleaningTimeForOneRoom <=
        Math.floor(totalCleaningTime / 2);

    if (IS_CLEANING_TIME_FIT_FOR_SINGLE_CLEANER) {
      updateCleaner(cleanerA, room, cleaningTimeForOneRoom);
    } else if (!cleanerA.has(room)) {
      updateCleaner(cleanerB, room, cleaningTimeForOneRoom);
    }
  }
  return [cleanerA, cleanerB];
}

console.log({ cleanerA, cleanerB });
