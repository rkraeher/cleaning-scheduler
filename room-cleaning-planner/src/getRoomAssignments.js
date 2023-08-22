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
  const totalCleaningTime = sumCleaningTime(roomsMap);
  const halfTotalCleaningTime = getRoundedHalfCleaningTime(totalCleaningTime);

  // 1. loop to add up to the half sum to cleanerA, the rest to cleanerB
  // 2. return cleanerA and B / check tests
  const { roomsListA, roomsListB } = getRoomsLists(roomsMap);
  // 3. implement balanceRoomLists

  // for dev purposes
  const sumA = sumCleaningTime(roomsListA);
  const sumB = sumCleaningTime(roomsListB);

  console.log({
    roomsMap,
    totalCleaningTime,
    halfTotalCleaningTime,
    roomsListA,
    roomsListB,
    sumA,
    sumB,
  });
  return { roomsListA, roomsListB };

  function getRoundedHalfCleaningTime(totalCleaningTime) {
    const halfTotalCleaningTime = totalCleaningTime / 2;
    const stayTime = CLEANING_TIMES_IN_MINUTES.STAY;
    const roundedHalfCleaningTime =
      Math.round(halfTotalCleaningTime / stayTime) * stayTime;
    return roundedHalfCleaningTime;
  }

  function getRoomsLists(roomsMap) {
    const roomsListA = new Map();
    const roomsListB = new Map();

    for (const [room, time] of roomsMap) {
      if (sumCleaningTime(roomsListA) + time <= halfTotalCleaningTime) {
        roomsListA.set(room, time);
      } else {
        roomsListB.set(room, time);
      }
    }

    return {
      roomsListA,
      roomsListB,
    };
  }
}

export function setRoomsMap(rooms) {
  let roomsMap = new Map();

  for (const [roomNumber, cleaningTimeCode, , roomState] of rooms) {
    const cleaningTime =
      roomState === roomStates.STAY
        ? CLEANING_TIMES_IN_MINUTES['STAY']
        : CLEANING_TIMES_IN_MINUTES[cleaningTimeCode[0]];
    // only the first letter from the timeCodes cell is needed to set the cleaningTime for a room

    roomsMap.set(roomNumber, cleaningTime);
  }
  return roomsMap;
}

function balanceRoomLists(organisedRoomsA, organisedRoomsB) {
  // const sumDifference = Math.abs(sumCleaningTimesA - sumCleaningTimesB);

  if (sumDifference <= 30) return { organisedRoomsA, organisedRoomsB };

  transferRooms();

  // helpers
  function transferRooms() {
    const [longerRoomsList, shorterRoomsList] =
      sumCleaningTimesA > sumCleaningTimesB
        ? [organisedRoomsA, organisedRoomsB]
        : [organisedRoomsB, organisedRoomsA];

    const key = getKey();

    // 1. const room = getOneRoom(longer, key);
    // 2. removeOneRoom(longer, key);
    // 3. addOneRoom(short, [key, room]);
    // 4. return balanceRoomsLists(longerRoomsList, shorterRoomsList)

    function getKey() {
      const times = [120, 60, 30];
      return times.find(
        (time) => sumDifference > time && longerRoomsList.has(time)
      );
    }

    // console.log({ longerRoomsList, shorterRoomsList, sumDifference, key });
  }
}

export function sumCleaningTime(rooms) {
  return [...rooms.values()].reduce((sum, time) => sum + time, 0);
}

//* main function call for development
getBalancedRoomLists(availableRooms);
