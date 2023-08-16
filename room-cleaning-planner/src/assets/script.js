// import { CLEANING_TIMES_IN_MINUTES, roomStates } from './constants';

// // const [cleanerA, cleanerB] = getRoomAssignments(setRoomsMap(availableRooms));
// // const totalCleaningTimeCleanerA = sumTotalCleaningTime(cleanerA);
// // const totalCleaningTimeCleanerB = sumTotalCleaningTime(cleanerB);

// // TODO: during refactor I want to replace as many loops with pipelines as possible

// // createRoomAndCleaningTimeMap
// export function setRoomsMap(rooms) {
//   let roomsMap = new Map();

//   for (const [roomNumber, cleaningTimeCode, , roomState] of rooms) {
//     if (roomState === roomStates.STAY) {
//       roomsMap.set(roomNumber, CLEANING_TIMES_IN_MINUTES['STAY']);
//     } else {
//       // only the first letter from the timeCodes cell is needed to set the cleaningTimeForOneRoom
//       roomsMap.set(roomNumber, CLEANING_TIMES_IN_MINUTES[cleaningTimeCode[0]]);
//     }
//   }
//   return roomsMap;
// }

// export function sumTotalCleaningTime(cleaner) {
//   return [...cleaner.values()].reduce((sum, value) => sum + value, 0);
// }

// // I need to understand this fn better
// function getClosestSumDifference(roomsMap) {
//   function calculatePossibleSums(start, currentSum, possibleSums) {
//     if (start === roomsMap.size) {
//       possibleSums.add(currentSum);
//       return;
//     }

//     const [, cleaningTime] = Array.from(roomsMap)[start];
//     calculatePossibleSums(start + 1, currentSum, possibleSums);
//     calculatePossibleSums(start + 1, currentSum + cleaningTime, possibleSums);
//   }

//   const possibleSums = new Set();
//   calculatePossibleSums(0, 0, possibleSums);

//   const exactlyEqualSum = sumTotalCleaningTime(roomsMap) / 2;
//   let closestSum = 0;

//   // this loop is its own fn?
//   for (const sum of possibleSums) {
//     if (sum <= exactlyEqualSum && sum > closestSum) {
//       closestSum = sum;
//     }
//   }

//   return closestSum;
// }

// function findRoomCombination(roomsMap, closestSum) {
//   let chosenRooms = new Map();

//   // I need to understand this fn better
//   function backtrack(start) {
//     const sum = sumTotalCleaningTime(chosenRooms);

//     if (sum === closestSum) return { chosenRooms };

//     // If the sum is greater than the closestSum or we have explored all rooms, stop
//     if (sum > closestSum || start === roomsMap.size) return null;

//     // Explore all possible combinations
//     let i = 0;
//     for (const [roomNumber, cleaningTime] of roomsMap) {
//       if (i >= start) {
//         chosenRooms.set(roomNumber, cleaningTime);

//         const result = backtrack(i + 1);
//         if (result) return result;

//         chosenRooms.delete(roomNumber);
//       }
//       i++;
//     }

//     return null;
//   }

//   // Start recursively backtracking from index 0
//   return backtrack(0);
// }

// // getCleanerRoomAssignments
// // main()
// export function getRoomAssignments(roomsMap) {
//   // prefer to call setRoomsMap from here
//   //   const roomsMap = setRoomsMap(rooms);
//   const { chosenRooms } = findRoomCombination(
//     roomsMap,
//     getClosestSumDifference(roomsMap)
//   );

//   let cleanerA = new Map(chosenRooms);
//   let cleanerB = new Map();

//   // forEach and async code....? it should be fine because its just operating on the argument
//   // the forEach callback isnt async forEach(async ()=> do stuff)
//   roomsMap.forEach((cleaningTime, roomNumber) => {
//     if (!cleanerA.has(roomNumber)) cleanerB.set(roomNumber, cleaningTime);
//   });
//   console.log({ cleanerA, cleanerB });
//   return [cleanerA, cleanerB];
// }
