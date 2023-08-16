const roomStates = {
  DEPARTURE: 'departure',
  STAY: 'stay',
};

const CLEANING_TIMES_IN_MINUTES = {
  STAY: 15,
  D: 30,
  Q: 60,
  O: 120,
};

const availableRooms = [
  ['101', 'DBS', 'till 12.08', 'departure'],
  ['102', 'QDB', 'available', 'departure'],
  ['103', 'QDS', 'available', 'departure'],
  ['104', 'DBS', 'available', 'departure'],
  ['105', 'DBS', 'available', 'departure'],
  ['106', 'DBS', 'available', 'departure'],
  ['107', 'DBV', 'till 12.08', 'departure'],
  ['108', 'DBI', 'available', 'departure'],
  ['109', 'DBI', 'till 12.08', 'departure'],
  ['110', 'DBI', 'available', 'departure'],
  ['111', 'DBI', 'till 12.08', 'departure'],
  ['112', 'DBI', 'available', 'departure'],
  ['113', 'DBI', 'available', 'departure'],
  ['114', 'QDA', 'till 12.08', 'departure'],
  ['115', 'QDA', 'till 12.08', 'departure'],
  ['116', 'DBA', 'available', 'departure'],
  ['117', 'DBI', 'available', 'departure'],
  ['201', 'DBB', 'available', 'departure'],
  ['202', 'QDS', 'available', 'departure'],
  ['203', 'OC1', 'available', 'departure'],
  ['204', 'OC2', 'available', 'departure'],
  ['205', 'DBN', 'available', 'departure'],
  ['206', 'DBN', 'till 13.08', 'departure'],
  ['207', 'DDY', 'available', 'departure'],
  ['208', 'DDY', 'till 13.08', 'departure'],
  ['209', 'DDY', 'available', 'departure'],
  ['210', 'DDY', 'available', 'departure'],
  ['211', 'DDY', 'till 13.08', 'departure'],
  ['212', 'DDY', 'available', 'departure'],
  ['213', 'DDY', 'till 14.08', 'departure'],
  ['214', 'QDY', 'available', 'departure'],
  ['215', 'DDY', 'till 15.08', 'departure'],
  ['216', 'DDY', 'available', 'departure'],
];

// util function
export function sumTotalCleaningTime(cleaner) {
  return [...cleaner.values()].reduce((sum, value) => sum + value, 0);
}

export function setRoomsMap(rooms) {
  let roomsMap = new Map();

  for (const [roomNumber, cleaningTimeCode, , roomState] of rooms) {
    if (roomState === roomStates.STAY) {
      roomsMap.set(roomNumber, CLEANING_TIMES_IN_MINUTES['STAY']);
    } else {
      // only the first letter from the timeCodes cell is needed to set the cleaningTimeForOneRoom
      roomsMap.set(roomNumber, CLEANING_TIMES_IN_MINUTES[cleaningTimeCode[0]]);
    }
  }
  return roomsMap;
}

export function calculateSums(roomsMap) {
  let firstFloor = new Map();
  let secondFloor = new Map();

  // I separate the rooms by floor
  // TODO extract function, rf loop into pipeline
  for (let [room, cleaningTime] of roomsMap) {
    if (room[0] === '1') {
      firstFloor.set(room, cleaningTime);
    } else {
      secondFloor.set(room, cleaningTime);
    }
  }

  let firstFloorRoomsByCleaningTime = new Map();

  // I organise the rooms according to their cleaning time
  // TODO extract function, rf loop into pipeline
  for (let [room, cleaningTime] of firstFloor) {
    console.log(room, cleaningTime);
    if (!firstFloorRoomsByCleaningTime.get(cleaningTime)) {
      firstFloorRoomsByCleaningTime.set(cleaningTime, [room]);
    } else {
      const values = firstFloorRoomsByCleaningTime.get(cleaningTime);
      firstFloorRoomsByCleaningTime.set(cleaningTime, [...values, room]);
    }
  }

  const firstFloorSum = sumTotalCleaningTime(firstFloor);
  const secondFloorSum = sumTotalCleaningTime(secondFloor);
  const sumDifference = Math.abs(firstFloorSum - secondFloorSum);

  console.log({
    // roomsMap,
    // firstFloor,
    // secondFloor,
    firstFloorSum,
    secondFloorSum,
    sumDifference,
    firstFloorRoomsByCleaningTime,
  });
  return {
    firstFloorSum,
    secondFloorSum,
    sumDifference,
    firstFloorRoomsByCleaningTime,
  };
}

export function getRoomAssignments(rooms) {
  const roomsMap = setRoomsMap(rooms);
  calculateSums(roomsMap);
}

getRoomAssignments(availableRooms);
