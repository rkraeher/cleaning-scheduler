import { CLEANING_TIMES_IN_MINUTES, roomStates } from './constants';

export function getBalancedRoomLists(rooms) {
  const roomsMap = mapRoomsToCleaningTimes(rooms);

  return distributeRooms(roomsMap);
}

export function mapRoomsToCleaningTimes(rooms) {
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

  return { roomsListA, roomsListB };

  function getRoundedHalfCleaningTime(totalCleaningTime) {
    const halfTotalCleaningTime = totalCleaningTime / 2;
    const stayTime = CLEANING_TIMES_IN_MINUTES.STAY;
    const roundedHalfCleaningTime =
      Math.round(halfTotalCleaningTime / stayTime) * stayTime;

    return roundedHalfCleaningTime;
  }
}

export function sumCleaningTime(rooms) {
  return [...rooms.values()].reduce((sum, time) => sum + time, 0);
}
