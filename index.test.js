import {
  CLEANING_TIMES_IN_MINUTES,
  availableRooms,
  setRoomsMap,
  calculateTotalCleaningTime,
  getRoomAssignments,
} from './index';

describe('calculateTotalCleaningTime', () => {
  test('should calculate total cleaning time correctly', () => {
    const totalCleaningTime = calculateTotalCleaningTime(
      setRoomsMap(availableRooms),
      CLEANING_TIMES_IN_MINUTES
    );

    const expectedTotalCleaningTime = 750;

    expect(totalCleaningTime).toBe(expectedTotalCleaningTime);
  });

  // more tests could account for floats, negatives, and non-number values in the roomsMap
});

describe.skip('getRoomAssignments', () => {
  // should divide the totalCleaningTime in half
  // should assign rooms to each cleaner
  // should handle an even-numbered totalCleaningTime
  // should handle an odd-numbered totalCleaningTime
  // if odd totalCleaningTime, never a difference > 30 min between the cleaners
  test('should evenly assign rooms to two cleaners according to the required cleaning times', () => {
    const roomsMap = setRoomsMap(availableRooms);

    const totalCleaningTime = calculateTotalCleaningTime(
      roomsMap,
      CLEANING_TIMES_IN_MINUTES
    );

    const [cleanerA, cleanerB] = getRoomAssignments(
      roomsMap,
      CLEANING_TIMES_IN_MINUTES,
      totalCleaningTime
    );

    expect(cleanerA.get(101)).toBe(30);
  });
});
