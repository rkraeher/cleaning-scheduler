// we loop through entire workbook
// anything that is 'available' or till ...next day = departure ('Q','D', or 'O' cleaning time)
// everything that has till ...2 days in future, = occupied (15 mins)
const CLEANING_TIMES_IN_MINUTES = {
  D: 30,
  Q: 60,
  O: 120,
};

// this data will come from the spreadsheet
const availableRooms = {
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

const [cleanerA, cleanerB] = getRoomAssignments(setRoomsMap(availableRooms));

export function setRoomsMap(availableRooms) {
  let roomsMap = new Map();

  for (const [roomNumber, cleaningTimeCodes] of Object.entries(
    availableRooms
  )) {
    // only the first letter from the codes column is needed to get the cleaningTimeForOneRoom
    roomsMap.set(roomNumber, CLEANING_TIMES_IN_MINUTES[cleaningTimeCodes[0]]);
  }

  return roomsMap;
}

export function calculateTotalCleaningTime(roomsMap) {
  let totalCleaningTime = 0;
  for (const cleaningTime of roomsMap.values()) {
    totalCleaningTime += cleaningTime;
  }
  return totalCleaningTime;
}

export function getRoomAssignments(roomsMap) {
  const TOTAL_CLEANING_TIME_FOR_ONE_CLEANER = 'totalCleaningTimeForOneCleaner';
  const totalCleaningTime = calculateTotalCleaningTime(roomsMap);

  let cleanerA = new Map([[TOTAL_CLEANING_TIME_FOR_ONE_CLEANER, 0]]);
  let cleanerB = new Map([[TOTAL_CLEANING_TIME_FOR_ONE_CLEANER, 0]]);

  function updateCleaner(cleaner, room) {
    const [roomNumber, cleaningTimeForOneRoom] = room;

    cleaner.set(roomNumber, cleaningTimeForOneRoom);
    cleaner.set(
      TOTAL_CLEANING_TIME_FOR_ONE_CLEANER,
      cleaner.get(TOTAL_CLEANING_TIME_FOR_ONE_CLEANER) + cleaningTimeForOneRoom
    );
  }

  for (const room of roomsMap) {
    const [, cleaningTimeForOneRoom] = room;
    const totalCleaningTimeForOneCleaner = cleanerA.get(
      TOTAL_CLEANING_TIME_FOR_ONE_CLEANER
    );

    const isCleaningTimeFitForOneCleaner =
      totalCleaningTimeForOneCleaner < Math.floor(totalCleaningTime / 2) &&
      totalCleaningTimeForOneCleaner + cleaningTimeForOneRoom <=
        Math.floor(totalCleaningTime / 2);

    if (isCleaningTimeFitForOneCleaner) {
      updateCleaner(cleanerA, room);
    } else if (!cleanerA.has(room)) {
      updateCleaner(cleanerB, room);
    }
  }
  return [cleanerA, cleanerB];
}

console.log({ cleanerA, cleanerB });
