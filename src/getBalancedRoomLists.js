import { CLEANING_TIMES_IN_MINUTES, ROOM_STATES } from './constants';

export function getBalancedRoomLists(rooms) {
  const roomsMap =
    mapSpecificCleaningTimeToEachRoomBasedOnOccupancyState(rooms);
  return distributeRooms(roomsMap);
}

export function mapSpecificCleaningTimeToEachRoomBasedOnOccupancyState(rooms) {
  const roomsMap = {};

  for (const [roomNumber, cleaningTimeCode, , , roomState] of rooms) {
    // only the first letter (index 0) from the timeCodes cell is needed to set the departure cleaningTime for a room
    const departure = cleaningTimeCode[0];

    const cleaningTime =
      roomState === ROOM_STATES.DEPARTURE
        ? CLEANING_TIMES_IN_MINUTES[departure]
        : CLEANING_TIMES_IN_MINUTES[roomState];

    roomsMap[roomNumber] = { cleaningTime, roomState };
  }
  return roomsMap;
}

function distributeRooms(roomsMap) {
  const roomsListA = createRoomList();
  const roomsListB = createRoomList();

  const halfTotalCleaningTime = getRoundedHalfCleaningTime(
    sumCleaningTime(roomsMap)
  );

  for (const room in roomsMap) {
    const roomData = {
      cleaningTime: roomsMap[room].cleaningTime,
      roomState: roomsMap[room].roomState,
    };

    const targetList =
      roomsListA.totalCleaningTime + roomData.cleaningTime <=
      halfTotalCleaningTime
        ? roomsListA
        : roomsListB;

    targetList.rooms[room] = roomData;
    accumulateStayAndDepartureTotalCleaningTime(roomData, targetList);
    targetList.totalCleaningTime += roomData.cleaningTime;
  }

  console.log({ roomsListA, roomsListB });
  return { roomsListA, roomsListB };
}

function createRoomList() {
  return {
    totalStaysCleaningTime: 0,
    totalDeparturesCleaningTime: 0,
    totalCleaningTime: 0,
    rooms: {},
  };
}

function accumulateStayAndDepartureTotalCleaningTime(roomData, roomsList) {
  if (roomData.roomState === ROOM_STATES.STAY) {
    roomsList.totalStaysCleaningTime += roomData.cleaningTime;
  }
  if (roomData.roomState === ROOM_STATES.DEPARTURE) {
    roomsList.totalDeparturesCleaningTime += roomData.cleaningTime;
  }
}

function getRoundedHalfCleaningTime(totalCleaningTime) {
  const halfTotalCleaningTime = totalCleaningTime / 2;
  const stayTime = CLEANING_TIMES_IN_MINUTES.stay;
  return Math.round(halfTotalCleaningTime / stayTime) * stayTime;
}

export function sumCleaningTime(rooms) {
  return Object.values(rooms).reduce((sum, room) => sum + room.cleaningTime, 0);
}
