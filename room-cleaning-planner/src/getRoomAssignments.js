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

//console.assert(); there will never be 0 rooms
export function getBalancedRoomLists(rooms) {
  const roomsMap = setRoomsMap(rooms);
  const [firstFloorRooms, secondFloorRooms] = separateRoomsByFloor(roomsMap);

  const organisedFloor1 = organiseRoomsByCleaningTime(firstFloorRooms);
  const organisedFloor2 = organiseRoomsByCleaningTime(secondFloorRooms);

  const firstFloorSum = sumCleaningTime(organisedFloor1);
  const secondFloorSum = sumCleaningTime(organisedFloor2);

  //* the WIP balancing starts
  // longerRoomsAssignment, shorterRoomsAssignment
  const [cleanerA, cleanerB] =
    firstFloorSum > secondFloorSum
      ? [organisedFloor1, organisedFloor2]
      : [organisedFloor2, organisedFloor1];

  //   while (sumDifference >= 30){}
  if (
    // for testing the sumDif condition is removed
    // sumDif >= 120 &&
    // cleanerA and cleanerB should be replaced by sorted 'largerCleaner' and 'smallerCleaner
    cleanerA.has(120)
  ) {
    // remove one line of 120 from setOfBig
    let stack = [];
    let roomsA = cleanerA.get(120);
    let roomsB = cleanerB.get(120) ?? [];

    stack.push(roomsA[roomsA.length - 1]);
    roomsA.pop();
    // add it to small
    roomsB.push(stack[0]);

    // set new values for cleaners
    cleanerA.set(120, roomsA);
    cleanerB.set(120, roomsB);

    // recheck the sum dif, which must stay up to date with the mutated cleaner lists;
    // possible recursive call?

    //* the WIP balancing ends

    const cleaningTimesCleanerA = sumCleaningTime(cleanerA);
    const cleaningTimesCleanerB = sumCleaningTime(cleanerB);

    console.log({
      roomsA,
      cleanerA,
      roomsB,
      cleanerB,
      cleaningTimesCleanerA,
      cleaningTimesCleanerB,
    });
  }

  return [cleanerA, cleanerB];
}

// its more like, mapCleaningTimesToRooms / getListOfRoomsWithCleaningTimes but I like the short and simple name in this case
// getRoomsWithTimes / mapRoomsAndTimes
export function setRoomsMap(rooms) {
  let roomsMap = new Map();

  // for (const [roomNumber, cleaningTimeCode, , roomState] of rooms) {
  //     const cleaningTime =
  //       roomState === roomStates.STAY
  //         ? CLEANING_TIMES_IN_MINUTES['STAY']
  //         : CLEANING_TIMES_IN_MINUTES[cleaningTimeCode[0]];
  // only the first letter from the timeCodes cell is needed to set the cleaningTimeForOneRoom

  //     roomsMap.set(roomNumber, cleaningTime);
  //   }
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

export function separateRoomsByFloor(roomsMap) {
  let firstFloorRooms = new Map();
  let secondFloorRooms = new Map();

  //   for (let [room, cleaningTime] of roomsMap) {
  //     const targetFloor = room[0] === '1' ? firstFloorRooms : secondFloorRooms;
  //     targetFloor.set(room, cleaningTime);
  //   }
  for (let [room, cleaningTime] of roomsMap) {
    if (room[0] === '1') {
      firstFloorRooms.set(room, cleaningTime);
    } else {
      secondFloorRooms.set(room, cleaningTime);
    }
  }

  return [firstFloorRooms, secondFloorRooms];
}

export function organiseRoomsByCleaningTime(floorSeparatedRooms) {
  let timeOrganisedRooms = new Map();

  // for (let [room, cleaningTime] of floorSeparatedRooms) {
  //   const rooms = timeOrganisedRooms.get(cleaningTime) || [];
  //   timeOrganisedRooms.set(cleaningTime, [...rooms, room]);
  // }

  // timeOrganisedRooms.set('totalSum', totalSum);
  for (let [room, cleaningTime] of floorSeparatedRooms) {
    if (!timeOrganisedRooms.get(cleaningTime)) {
      timeOrganisedRooms.set(cleaningTime, [room]);
    } else {
      const rooms = timeOrganisedRooms.get(cleaningTime);
      timeOrganisedRooms.set(cleaningTime, [...rooms, room]);
    }
  }

  return timeOrganisedRooms;
}

export function sumCleaningTime(timeOrganisedRooms) {
  const cleaningTimes = [...timeOrganisedRooms.keys()];

  return cleaningTimes.reduce((sum, cleaningTime) => {
    const rooms = timeOrganisedRooms.get(cleaningTime);
    return sum + cleaningTime * rooms.length;
  }, 0);
}

//* main function call for development
getBalancedRoomLists(availableRooms);
