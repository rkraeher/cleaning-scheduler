import { setRoomsMap, sumTotalCleaningTime, getRoomAssignments } from './index';

const mockAvailableRooms = {
  101: 'DBS',
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

describe('getRoomAssignments', () => {
  it('should distribute all the rooms between two cleaners', () => {
    const roomsMap = setRoomsMap(mockAvailableRooms);
    const [cleanerA, cleanerB] = getRoomAssignments(roomsMap);
    const allRooms = [...roomsMap.keys()];

    expect(
      allRooms.every((room) => cleanerA.has(room) || cleanerB.has(room))
    ).toBeTruthy();
  });

  it('should only assign a room to one cleaner (no duplicate assignments)', () => {
    const roomsMap = setRoomsMap(mockAvailableRooms);
    const [cleanerA, cleanerB] = getRoomAssignments(roomsMap);

    const cleanerArooms = ['101', '102', '103', '203', '207', '211', '215'];
    const cleanerBrooms = ['210', '212', '213', '214', '216'];

    cleanerArooms.forEach((roomNumber) => {
      expect(cleanerA.has(roomNumber)).toBeTruthy();
      expect(cleanerB.has(roomNumber)).toBeFalsy();
    });

    cleanerBrooms.forEach((roomNumber) => {
      expect(cleanerA.has(roomNumber)).toBeFalsy();
      expect(cleanerB.has(roomNumber)).toBeTruthy();
    });

    // Check that there are no duplicate rooms
    const allRooms = [...cleanerA.keys(), ...cleanerB.keys()];
    const uniqueRooms = new Set(allRooms);
    expect(uniqueRooms.size).toBe(allRooms.length);
  });

  it('should equally divide the room cleaningTimes if possible', () => {
    const roomsWithEquallyDistributableCleaningTimes = {
      101: 'DBS',
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
    };

    const [cleanerA, cleanerB] = getRoomAssignments(
      setRoomsMap(roomsWithEquallyDistributableCleaningTimes)
    );

    const totalCleaningTimeCleanerA = sumTotalCleaningTime(cleanerA);
    const totalCleaningTimeCleanerB = sumTotalCleaningTime(cleanerB);

    expect(totalCleaningTimeCleanerA).toEqual(totalCleaningTimeCleanerB);
  });

  it('should handle a totalCleaningTime that cannot be equally divided', () => {
    const roomsWithOddNumberedTotalCleaningTime = {
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

    const roomsMap = setRoomsMap(roomsWithOddNumberedTotalCleaningTime);
    const [cleanerA, cleanerB] = getRoomAssignments(roomsMap);
    const oddNumberedTotalCleaningTime = sumTotalCleaningTime(roomsMap);
    const totalCleaningTimeCleanerA = sumTotalCleaningTime(cleanerA);
    const totalCleaningTimeCleanerB = sumTotalCleaningTime(cleanerB);

    expect(oddNumberedTotalCleaningTime % 2 == 1).toBeTruthy();
    expect(totalCleaningTimeCleanerA).not.toEqual(totalCleaningTimeCleanerB);
  });

  it('should minimize the cleaningTime difference between both cleaners', () => {
    const roomsWithUnequallyDistributableCleaningTimes = {
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

    const [cleanerA, cleanerB] = getRoomAssignments(
      setRoomsMap(roomsWithUnequallyDistributableCleaningTimes)
    );

    const totalCleaningTimeCleanerA = sumTotalCleaningTime(cleanerA);
    const totalCleaningTimeCleanerB = sumTotalCleaningTime(cleanerB);

    const timeDifference = Math.abs(
      totalCleaningTimeCleanerA - totalCleaningTimeCleanerB
    );

    expect(timeDifference).toBeLessThanOrEqual(30);
  });

  // it('should maximize the number of rooms on the same floor for each cleaners (.e.g, cleanerA mostly has floor 1 rooms')

  // edgecase: 0 or 1 room to clean should never happen for this usecase
  // edgecase: 1 or 3+ cleaners should never happen for this usecase
});
