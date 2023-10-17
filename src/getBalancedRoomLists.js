import { CLEANING_TIMES_IN_MINUTES, ROOM_STATES } from './constants';

export function getBalancedRoomLists(rooms) {
  const roomsMap =
    mapSpecificCleaningTimeToEachRoomBasedOnOccupancyState(rooms);
  return distributeRooms(roomsMap);
}

export function mapSpecificCleaningTimeToEachRoomBasedOnOccupancyState(rooms) {
  const roomsMap = {};

  for (const room of rooms) {
    const [roomNumber, cleaningTimeCode, availability, leftover, roomState] =
      room;
    // only the first letter (index 0) from the timeCodes cell is needed to set the departure cleaningTime for a room
    const departure = cleaningTimeCode[0];

    const cleaningTime =
      roomState === ROOM_STATES.DEPARTURE
        ? CLEANING_TIMES_IN_MINUTES[departure]
        : CLEANING_TIMES_IN_MINUTES[roomState];

    roomsMap[roomNumber] = {
      cleaningTime,
      cleaningTimeCode,
      availability,
      leftover,
      roomState,
    };
  }

  return roomsMap;
}

function distributeRooms(roomsMap) {
  const roomsListA = createRoomList();
  const roomsListB = createRoomList();

  const halfTotalCleaningTime = getRoundedHalfCleaningTime(roomsMap);

  for (const [roomNumber, roomData] of Object.entries(roomsMap)) {
    // keep the first and second floors on listA and listB respectively for vacant rooms
    const isRoomSecondFloorVacant =
      roomData.roomState === ROOM_STATES.VACANT &&
      parseInt(roomNumber, 10) >= 200;

    const targetList =
      roomsListA.totalCleaningTime + roomData.cleaningTime <=
        halfTotalCleaningTime && !isRoomSecondFloorVacant
        ? roomsListA
        : roomsListB;

    updateTargetList({ roomNumber, ...roomData }, targetList);
  }

  const allRoomsList = getAllRoomsList(roomsListA, roomsListB);

  prepareOutput(roomsListA, roomsListB, allRoomsList);

  return { roomsListA, roomsListB, allRoomsList };
}

function createRoomList() {
  return {
    totalStaysCleaningTime: 0,
    totalDeparturesCleaningTime: 0,
    totalCleaningTime: 0,
    rooms: [],
  };
}

function getRoundedHalfCleaningTime(roomsMap) {
  const halfTotalCleaningTime = sumCleaningTime(roomsMap) / 2;
  const stayTime = CLEANING_TIMES_IN_MINUTES.stay;
  // ensures the result is a multiple of 15, the smallest possible increment
  return Math.round(halfTotalCleaningTime / stayTime) * stayTime;
}

export function sumCleaningTime(rooms) {
  return Object.values(rooms).reduce((sum, room) => sum + room.cleaningTime, 0);
}

function updateTargetList(room, targetList) {
  targetList.rooms.push(room);
  updateCleaningTimes(room, targetList);
}

function updateCleaningTimes(room, roomsList) {
  if (room.roomState === ROOM_STATES.STAY) {
    roomsList.totalStaysCleaningTime += room.cleaningTime;
    roomsList.totalCleaningTime += room.cleaningTime;
  }
  if (room.roomState === ROOM_STATES.DEPARTURE) {
    roomsList.totalDeparturesCleaningTime += room.cleaningTime;
    roomsList.totalCleaningTime += room.cleaningTime;
  }
}

function prepareOutput(roomsListA, roomsListB, allRoomsList) {
  // we don't need the individual room cleaningTimes in the output
  deleteCleaningTimeFromRoomsList(roomsListA);
  deleteCleaningTimeFromRoomsList(roomsListB);

  formatCleaningTimeTotals({ roomsListA, roomsListB, allRoomsList });
}

function getAllRoomsList(roomsListA, roomsListB) {
  const totalStaysCleaningTime =
    roomsListA.totalStaysCleaningTime + roomsListB.totalStaysCleaningTime;
  const totalDeparturesCleaningTime =
    roomsListA.totalDeparturesCleaningTime +
    roomsListB.totalDeparturesCleaningTime;
  const totalCleaningTime =
    roomsListA.totalCleaningTime + roomsListB.totalCleaningTime;
  return {
    totalStaysCleaningTime,
    totalDeparturesCleaningTime,
    totalCleaningTime,
    rooms: [...roomsListA.rooms, ...roomsListB.rooms],
  };
}

function deleteCleaningTimeFromRoomsList(roomsList) {
  for (const roomData of roomsList.rooms) {
    delete roomData.cleaningTime;
  }
}

function formatCleaningTimeTotals(roomsLists = {}) {
  for (const list of Object.values(roomsLists)) {
    const {
      totalCleaningTime,
      totalDeparturesCleaningTime,
      totalStaysCleaningTime,
    } = list;

    list.totalCleaningTime = convertMinutesToHoursAndMinutes(totalCleaningTime);
    list.totalDeparturesCleaningTime = convertMinutesToHoursAndMinutes(
      totalDeparturesCleaningTime
    );
    list.totalStaysCleaningTime = convertMinutesToHoursAndMinutes(
      totalStaysCleaningTime
    );
  }
}

function convertMinutesToHoursAndMinutes(totalMinutes) {
  if (isNaN(totalMinutes)) {
    return 'Invalid minutes input. Cannot convert to %h %m format';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  return formattedTime;
}
