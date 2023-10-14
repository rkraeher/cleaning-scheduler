import {
  CLEANING_TIMES_IN_MINUTES,
  ROOM_STATES,
  TOTAL_CLEANING_TIME,
} from './constants';

export function getBalancedRoomLists(rooms) {
  const { roomsMap, roomsMap2 } = mapRoomsToCleaningTimes(rooms);

  return distributeRooms(roomsMap, roomsMap2);
}

export function mapRoomsToCleaningTimes(rooms) {
  let roomsMap = new Map();
  const roomsMap2 = {};

  for (const [roomNumber, cleaningTimeCode, , , roomState] of rooms) {
    // only the first letter (index 0) from the timeCodes cell is needed to set the departure cleaningTime for a room
    const departure = cleaningTimeCode[0];
    const cleaningTime =
      roomState === ROOM_STATES.DEPARTURE
        ? CLEANING_TIMES_IN_MINUTES[departure]
        : CLEANING_TIMES_IN_MINUTES[roomState];

    // add an additional value here, roomState; rename the mapping fn
    roomsMap2[roomNumber] = { cleaningTime, roomState };
    roomsMap.set(roomNumber, cleaningTime);
  }
  return { roomsMap, roomsMap2 };
}

function distributeRooms(roomsMap, roomsMap2) {
  const roomsListA = new Map();
  const roomsListB = new Map();

  const roomsListA2 = new Map();
  const roomsListB2 = new Map();
  // why we need this separate map instead of just roomsLists?
  const staysAndDepsSumA = new Map();
  const staysAndDepsSumB = new Map();

  const halfTotalCleaningTime = getRoundedHalfCleaningTime(
    sumCleaningTime(roomsMap)
  );
  const halfTotalCleaningTime2 = getRoundedHalfCleaningTime(
    sumCleaningTime2(roomsMap2)
  );

  for (const [room, time] of roomsMap) {
    sumCleaningTime(roomsListA) + time <= halfTotalCleaningTime
      ? roomsListA.set(room, time)
      : roomsListB.set(room, time);
  }

  for (const room in roomsMap2) {
    const cleaningTime = roomsMap2[room]['cleaningTime'];
    const roomState = roomsMap2[room]['roomState'];

    if (sumCleaningTime(roomsListA2) + cleaningTime <= halfTotalCleaningTime2) {
      roomsListA2.set(room, cleaningTime);
      calculateStaysAndDeps(cleaningTime, roomState, staysAndDepsSumA);
    } else {
      roomsListB2.set(room, cleaningTime);
      calculateStaysAndDeps(cleaningTime, roomState, staysAndDepsSumB);
    }
  }

  // we can also setRoomsListX.set(room, roomsData.time), inside this function?
  function calculateStaysAndDeps(time, state, staysAndDepsSum) {
    if (state === ROOM_STATES.STAY) {
      const currentSum = staysAndDepsSum.get('Stays') || 0;
      staysAndDepsSum.set('Stays', currentSum + time);
    }
    if (state === ROOM_STATES.DEPARTURE) {
      const currentSum = staysAndDepsSum.get('Departures') || 0;
      staysAndDepsSum.set('Departures', currentSum + time);
    }
  }

  roomsListA.set(TOTAL_CLEANING_TIME, sumCleaningTime(roomsListA));
  roomsListB.set(TOTAL_CLEANING_TIME, sumCleaningTime(roomsListB));

  console.log({ roomsListA2, staysAndDepsSumA, roomsListB2, staysAndDepsSumB });

  return { roomsListA, roomsListB };

  function getRoundedHalfCleaningTime(totalCleaningTime) {
    const halfTotalCleaningTime = totalCleaningTime / 2;
    const stayTime = CLEANING_TIMES_IN_MINUTES.stay;
    const roundedHalfCleaningTime =
      Math.round(halfTotalCleaningTime / stayTime) * stayTime;

    return roundedHalfCleaningTime;
  }
}

function sumCleaningTime2(rooms) {
  return Object.values(rooms).reduce((sum, room) => sum + room.cleaningTime, 0);
}

export function sumCleaningTime(rooms) {
  return [...rooms.values()].reduce((sum, time) => sum + time, 0);
}
