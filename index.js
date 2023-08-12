import { CLEANING_TIMES_IN_MINUTES } from './room-cleaning-planner/src/constants';

// const [cleanerA, cleanerB] = getRoomAssignments(setRoomsMap(availableRooms));
// const totalCleaningTimeCleanerA = sumTotalCleaningTime(cleanerA);
// const totalCleaningTimeCleanerB = sumTotalCleaningTime(cleanerB);

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

export function sumTotalCleaningTime(cleaner) {
  return [...cleaner.values()].reduce((sum, value) => sum + value, 0);
}

function getClosestSumDifference(roomsMap) {
  function calculatePossibleSums(start, currentSum, possibleSums) {
    if (start === roomsMap.size) {
      possibleSums.add(currentSum);
      return;
    }

    const [, cleaningTime] = Array.from(roomsMap)[start];
    calculatePossibleSums(start + 1, currentSum, possibleSums);
    calculatePossibleSums(start + 1, currentSum + cleaningTime, possibleSums);
  }

  const possibleSums = new Set();
  calculatePossibleSums(0, 0, possibleSums);

  const exactlyEqualSum = sumTotalCleaningTime(roomsMap) / 2;
  let closestSum = 0;

  for (const sum of possibleSums) {
    if (sum <= exactlyEqualSum && sum > closestSum) {
      closestSum = sum;
    }
  }

  return closestSum;
}

function findRoomCombination(roomsMap, closestSum) {
  let chosenRooms = new Map();

  function backtrack(start) {
    const sum = sumTotalCleaningTime(chosenRooms);

    if (sum === closestSum) return { chosenRooms };

    // If the sum is greater than the closestSum or we have explored all rooms, stop
    if (sum > closestSum || start === roomsMap.size) return null;

    // Explore all possible combinations
    let i = 0;
    for (const [roomNumber, cleaningTime] of roomsMap) {
      if (i >= start) {
        chosenRooms.set(roomNumber, cleaningTime);

        const result = backtrack(i + 1);
        if (result) return result;

        chosenRooms.delete(roomNumber);
      }
      i++;
    }

    return null;
  }

  // Start recursively backtracking from index 0
  return backtrack(0);
}

export function getRoomAssignments(roomsMap) {
  // call setRoomsMap from in here
  const { chosenRooms } = findRoomCombination(
    roomsMap,
    getClosestSumDifference(roomsMap)
  );

  let cleanerA = new Map(chosenRooms);
  let cleanerB = new Map();

  roomsMap.forEach((cleaningTime, roomNumber) => {
    if (!cleanerA.has(roomNumber)) cleanerB.set(roomNumber, cleaningTime);
  });

  return [cleanerA, cleanerB];
}

// console.log({
//   cleanerA,
//   cleanerB,
//   totalCleaningTimeCleanerA,
//   totalCleaningTimeCleanerB,
// });
