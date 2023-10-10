import {
  CLEANING_TIMES_IN_MINUTES,
  ROOM_STATES,
  TOTAL_CLEANING_TIME,
} from './constants';

export function getBalancedRoomLists(rooms) {
  const roomsMap = mapRoomsToCleaningTimes(rooms);

  return distributeRooms(roomsMap);
}

export function mapRoomsToCleaningTimes(rooms) {
  let roomsMap = new Map();

  for (const [roomNumber, cleaningTimeCode, , , roomState] of rooms) {
    // only the first letter (index 0) from the timeCodes cell is needed to set the departure cleaningTime for a room
    const departure = cleaningTimeCode[0];
    const cleaningTime =
      roomState === ROOM_STATES.DEPARTURE
        ? CLEANING_TIMES_IN_MINUTES[departure]
        : CLEANING_TIMES_IN_MINUTES[roomState];

    roomsMap.set(roomNumber, cleaningTime);
  }
  return roomsMap;
}

function distributeRooms(roomsMap) {
  const roomsListA = new Map();
  const roomsListB = new Map();

  const halfTotalCleaningTime = getRoundedHalfCleaningTime(
    sumCleaningTime(roomsMap)
  );

  for (const [room, time] of roomsMap) {
    sumCleaningTime(roomsListA) + time <= halfTotalCleaningTime
      ? roomsListA.set(room, time)
      : roomsListB.set(room, time);
  }

  roomsListA.set(TOTAL_CLEANING_TIME, sumCleaningTime(roomsListA));
  roomsListB.set(TOTAL_CLEANING_TIME, sumCleaningTime(roomsListB));

  return { roomsListA, roomsListB };

  function getRoundedHalfCleaningTime(totalCleaningTime) {
    const halfTotalCleaningTime = totalCleaningTime / 2;
    const stayTime = CLEANING_TIMES_IN_MINUTES.stay;
    const roundedHalfCleaningTime =
      Math.round(halfTotalCleaningTime / stayTime) * stayTime;

    return roundedHalfCleaningTime;
  }
}

export function sumCleaningTime(rooms) {
  return [...rooms.values()].reduce((sum, time) => sum + time, 0);
}
