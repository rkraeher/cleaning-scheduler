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
  const totalSum = sumTotalCleaningTime(roomsMap);

  // Create a set to store all the possible sums of cleaning times
  const possibleSums = new Set();

  for (const [, cleaningTime] of roomsMap) {
    const newPossibleSums = new Set();
    for (const sum of possibleSums) {
      newPossibleSums.add(sum + cleaningTime);
    }
    possibleSums.add(cleaningTime);
    for (const sum of newPossibleSums) {
      possibleSums.add(sum);
    }
  }

  // Calculate the maximum sum that each cleaner should have
  const exactlyEqualSum = totalSum / 2;
  let closestSum = 0;

  // Find the closest sum to the maximum sum that can be achieved
  for (const sum of possibleSums) {
    if (sum <= exactlyEqualSum && sum > closestSum) {
      closestSum = sum;
    }
  }

  return closestSum;
}

// EDIT ME
function findRoomCombination(roomsMap, closestSum) {
  // IS THIS NECESSARY?
  const rooms = Array.from(roomsMap.entries()); // Convert the Map to an array of [roomNumber, cleaningTime] pairs
  const roomCount = rooms.length;
  let chosenRooms = [];

  // Helper function to calculate the sum of cleaning times for the given combination of rooms
  function calculateSum(combination) {
    return combination.reduce((sum, [, cleaningTime]) => sum + cleaningTime, 0);
  }

  // Helper function to perform backtracking
  function backtrack(start) {
    const sum = calculateSum(chosenRooms);

    // If the sum equals the closestSum, we found a valid combination
    if (sum === closestSum) {
      return { chosenRooms, closestSum };
    }

    // If the sum is greater than the closestSum or we have explored all rooms, stop
    if (sum > closestSum || start === roomCount) {
      return null;
    }

    // Explore all possible combinations
    for (let i = start; i < roomCount; i++) {
      chosenRooms.push(rooms[i]);
      const result = backtrack(i + 1);
      if (result) {
        return result;
      }
      chosenRooms.pop();
    }

    return null;
  }

  // Start backtracking from index 0
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
    // Check if the cleanerA map contains the room with the same room number
    if (!cleanerA.has(roomNumber)) {
      cleanerB.set(roomNumber, cleaningTime);
    }
  });

  return [cleanerA, cleanerB];
}

console.log({
  cleanerA,
  cleanerB,
  totalCleaningTimeCleanerA,
  totalCleaningTimeCleanerB,
});
