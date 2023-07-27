import {
  setRoomsMap,
  calculateTotalCleaningTime,
  getRoomAssignments,
} from './index';

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

describe('calculateTotalCleaningTime', () => {
  it('should calculate total cleaning time correctly', () => {
    const totalCleaningTime = calculateTotalCleaningTime(
      setRoomsMap(mockAvailableRooms)
    );

    const expectedTotalCleaningTime = 750;

    expect(totalCleaningTime).toBe(expectedTotalCleaningTime);
  });

  // unexpected data input could happen since it is based on user input
  // more tests for this method could account for floats, negatives, and non-number values in the roomsMap
});

describe('getRoomAssignments', () => {
  it('should distribute all the rooms between two cleaners', () => {
    const roomsMap = setRoomsMap(mockAvailableRooms);
    const [cleanerA, cleanerB] = getRoomAssignments(roomsMap);

    const cleanerArooms = ['101', '102', '103', '203', '207', '211', '215'];
    const cleanerBrooms = ['210', '212', '213', '214', '216'];

    expect(cleanerArooms.every((room) => cleanerA.has(room))).toBeTruthy();
    expect(cleanerBrooms.every((room) => cleanerB.has(room))).toBeTruthy();

    const allRooms = [...roomsMap.keys()];

    expect(
      allRooms.every((room) =>
        [...cleanerArooms, ...cleanerBrooms].includes(room)
      )
    ).toBeTruthy();

    expect(
      allRooms.every((room) => cleanerA.has(room) || cleanerB.has(room))
    ).toBeTruthy();
  });

  it('should only assign a room to one cleaner', () => {
    const roomsMap = setRoomsMap(mockAvailableRooms);
    const [cleanerA, cleanerB] = getRoomAssignments(roomsMap);

    const cleanerArooms = ['101', '102', '103', '203', '207', '211', '215'];
    const cleanerBrooms = ['210', '212', '213', '214', '216'];

    expect(cleanerArooms.every((room) => !cleanerB.has(room))).toBeTruthy();
    expect(cleanerBrooms.every((room) => !cleanerA.has(room))).toBeTruthy();
  });

  it('should handle an even-numbered totalCleaningTime', () => {
    const roomsWithEvenNumberedTotalCleaningTime = {
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

    const roomsMap = setRoomsMap(roomsWithEvenNumberedTotalCleaningTime);
    const [cleanerA, cleanerB] = getRoomAssignments(roomsMap);
    const evenNumberedTotalCleaningTime = calculateTotalCleaningTime(roomsMap);

    expect(evenNumberedTotalCleaningTime % 2 == 0).toBeTruthy();
    expect(cleanerA.get('totalCleaningTimeForOneCleaner')).toEqual(
      cleanerB.get('totalCleaningTimeForOneCleaner')
    );
  });

  it('should handle an odd-numbered totalCleaningTime', () => {
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
    const oddNumberedTotalCleaningTime = calculateTotalCleaningTime(roomsMap);

    expect(oddNumberedTotalCleaningTime % 2 == 1).toBeTruthy();
    expect(cleanerA.get('totalCleaningTimeForOneCleaner')).not.toEqual(
      cleanerB.get('totalCleaningTimeForOneCleaner')
    );
  });

  // 2. should only assign a room to one cleaner (no duplicate room assignments)
  // 3. should handle an even-numbered totalCleaningTime
  // 4. should handle an odd-numbered totalCleaningTime (e.g., one 15 min room)
  // 5. if an equal cleaningTime is not possible between two cleaners, should never have a cleaningTime difference > 30 min

  // edgecase: 0 or 1 room should never happen for this usecase
  // edgecase: 1 or 3 cleaner should never happen for this usecase
});
