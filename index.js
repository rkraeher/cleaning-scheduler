// we loop through entire workbook
// anything that is 'available' or till ...next day = departure ('Q','D', or 'O' cleaning time)
// everything that has till ...2 days in future, = occupied (15 mins)
const CLEANING_TIMES_IN_MINUTES = {
  A: 15,
  D: 30,
  Q: 60,
  O: 120,
};

// this data will come from the spreadsheet
const availableRooms = {
  101: 'ABS',
  102: 'QDB',
  103: 'QDS',
  203: 'OC1',
  207: 'DDY',
  210: 'ODY',
  211: 'DBS',
  212: 'QDB',
  213: 'QDS',
  214: 'OC1',
  215: 'DDY',
  216: 'DDY',
};

const [cleanerA, cleanerB] = getRoomAssignments(setRoomsMap(availableRooms));
const totalCleaningTimeCleanerA = sumTotalCleaningTime(cleanerA);
const totalCleaningTimeCleanerB = sumTotalCleaningTime(cleanerB);

export function setRoomsMap(availableRooms) {
  let roomsMap = new Map();

  for (const [roomNumber, cleaningTimeCodes] of Object.entries(
    availableRooms
  )) {
    // only the first letter from the codes column is needed to get the cleaningTimeForOneRoom
    roomsMap.set(roomNumber, CLEANING_TIMES_IN_MINUTES[cleaningTimeCodes[0]]);
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

console.log({
  cleanerA,
  cleanerB,
  totalCleaningTimeCleanerA,
  totalCleaningTimeCleanerB,
});
