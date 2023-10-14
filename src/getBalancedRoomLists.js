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

    updateTargetList({ room, roomData }, targetList);
  }

  console.log({ roomsListA, roomsListB });
  return { roomsListA, roomsListB };
}

function createRoomList() {
  return {
    totalStaysCleaningTime: 0,
    totalDeparturesCleaningTime: 0,
    totalCleaningTime: 0,
    rooms: [],
  };
}

function getRoundedHalfCleaningTime(totalCleaningTime) {
  const halfTotalCleaningTime = totalCleaningTime / 2;
  const stayTime = CLEANING_TIMES_IN_MINUTES.stay;
  return Math.round(halfTotalCleaningTime / stayTime) * stayTime;
}

export function sumCleaningTime(rooms) {
  return Object.values(rooms).reduce((sum, room) => sum + room.cleaningTime, 0);
}

function updateCleaningTimes(roomData, roomsList) {
  if (roomData.roomState === ROOM_STATES.STAY) {
    roomsList.totalStaysCleaningTime += roomData.cleaningTime;
    roomsList.totalCleaningTime += roomData.cleaningTime;
  }
  if (roomData.roomState === ROOM_STATES.DEPARTURE) {
    roomsList.totalDeparturesCleaningTime += roomData.cleaningTime;
    roomsList.totalCleaningTime += roomData.cleaningTime;
  }
}

function updateTargetList({ room, roomData }, targetList) {
  targetList.rooms.push(room);
  updateCleaningTimes(roomData, targetList);
}
