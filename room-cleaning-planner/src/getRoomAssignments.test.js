import {
  sumTotalCleaningTime,
  getBalancedRoomLists,
  setRoomsMap,
  calculateSumDifference,
  separateRoomsByFloor,
  organiseRoomsByCleaningTime,
} from './getRoomAssignments';

const rooms = [
  ['101', 'DBS', 'till 12.08', 'departure'],
  ['102', 'QDB', 'available', 'departure'],
  ['103', 'QDS', 'available', 'departure'],
  ['104', 'DBS', 'available', 'departure'],
  ['105', 'DBS', 'available', 'departure'],
  ['106', 'DBS', 'available', 'departure'],
  ['107', 'DBV', 'till 12.08', 'departure'],
  ['108', 'DBI', 'available', 'departure'],
  ['109', 'DBI', 'till 12.08', 'departure'],
  ['110', 'DBI', 'available', 'departure'],
  ['111', 'DBI', 'till 12.08', 'departure'],
  ['112', 'DBI', 'available', 'departure'],
  ['113', 'DBI', 'available', 'departure'],
  ['114', 'QDA', 'till 12.08', 'departure'],
  ['115', 'QDA', 'till 12.08', 'departure'],
  ['116', 'DBA', 'available', 'departure'],
  ['117', 'DBI', 'available', 'departure'],
  ['201', 'DBB', 'available', 'departure'],
  ['202', 'QDS', 'available', 'departure'],
  ['203', 'OC1', 'available', 'departure'],
  ['204', 'OC2', 'available', 'departure'],
  ['205', 'DBN', 'available', 'departure'],
  ['206', 'DBN', 'till 13.08', 'departure'],
  ['207', 'DDY', 'available', 'departure'],
  ['208', 'DDY', 'till 13.08', 'departure'],
  ['209', 'DDY', 'available', 'departure'],
  ['210', 'DDY', 'available', 'departure'],
  ['211', 'DDY', 'till 13.08', 'departure'],
  ['212', 'DDY', 'available', 'departure'],
  ['213', 'DDY', 'till 14.08', 'departure'],
  ['214', 'QDY', 'available', 'departure'],
  ['215', 'DDY', 'till 15.08', 'departure'],
  ['216', 'DDY', 'available', 'departure'],
];

const roomsMap = setRoomsMap(rooms);
const [firstFloorRooms, secondFloorRooms] = separateRoomsByFloor(roomsMap);

describe('separateRoomsByFloor', () => {
  it('should separate the rooms according to their floor', () => {
    const smallRoomsMap = new Map([
      ['101', 30],
      ['102', 60],
      ['201', 15],
      ['202', 30],
    ]);

    const [firstFloorRooms, secondFloorRooms] =
      separateRoomsByFloor(smallRoomsMap);

    expect(firstFloorRooms.size).toBe(2);
    expect(firstFloorRooms.get('101')).toBe(30);
    expect(firstFloorRooms.get('102')).toBe(60);

    expect(secondFloorRooms.size).toBe(2);
    expect(secondFloorRooms.get('201')).toBe(15);
    expect(secondFloorRooms.get('202')).toBe(30);
  });
});

describe('calculateSumDifference', () => {
  it('should calculate the difference between the sums of rooms on each floor', () => {
    const { firstFloorSum, secondFloorSum, sumDifference } =
      calculateSumDifference({ firstFloorRooms, secondFloorRooms });
    const sumAllCleaningTimes = sumTotalCleaningTime(roomsMap);

    expect(secondFloorSum - firstFloorSum).toEqual(sumDifference);
    expect(secondFloorSum + firstFloorSum).toEqual(sumAllCleaningTimes);
  });
});

describe('organiseRoomsByCleaningTime', () => {
  it('should organize the rooms on each floor based on their cleaningTime', () => {
    const expectedRoomsOrganizedByCleaningTime = new Map([
      [
        30,
        [
          '101',
          '104',
          '105',
          '106',
          '107',
          '108',
          '109',
          '110',
          '111',
          '112',
          '113',
          '116',
          '117',
        ],
      ],
      [60, ['102', '103', '114', '115']],
    ]);

    const firstFloorRoomsByCleaningTime =
      organiseRoomsByCleaningTime(firstFloorRooms);

    expect(firstFloorRoomsByCleaningTime).toEqual(
      expectedRoomsOrganizedByCleaningTime
    );
  });
});

// it should return a whole floor of rooms for each cleaner if the difference is 0
// it should balance the rooms to assign rooms with the minimal sum difference possible10
describe('getBalancedRoomLists', () => {
  // it('should distribute all the rooms between two cleaners', () => {
  //     expect(
  //   allRooms.every((room) => cleanerA.has(room) || cleanerB.has(room))
  // ).toBeTruthy();
  // });

  it.skip('should only assign a room to one cleaner (no duplicate assignments)', () => {
    const roomsMap = setRoomsMap(mockAvailableRooms);
    const [cleanerA, cleanerB] = getBalancedRoomLists(roomsMap);

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

  it.skip('should equally divide the room cleaningTimes if possible', () => {
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

    const [cleanerA, cleanerB] = getBalancedRoomLists(
      setRoomsMap(roomsWithEquallyDistributableCleaningTimes)
    );

    const totalCleaningTimeCleanerA = sumTotalCleaningTime(cleanerA);
    const totalCleaningTimeCleanerB = sumTotalCleaningTime(cleanerB);

    expect(totalCleaningTimeCleanerA).toEqual(totalCleaningTimeCleanerB);
  });

  it.skip('should handle a totalCleaningTime that cannot be equally divided', () => {
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
    const [cleanerA, cleanerB] = getBalancedRoomLists(roomsMap);
    const oddNumberedTotalCleaningTime = sumTotalCleaningTime(roomsMap);
    const totalCleaningTimeCleanerA = sumTotalCleaningTime(cleanerA);
    const totalCleaningTimeCleanerB = sumTotalCleaningTime(cleanerB);

    expect(oddNumberedTotalCleaningTime % 2 == 1).toBeTruthy();
    expect(totalCleaningTimeCleanerA).not.toEqual(totalCleaningTimeCleanerB);
  });

  it.skip('should minimize the cleaningTime difference between both cleaners', () => {
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

    const [cleanerA, cleanerB] = getBalancedRoomLists(
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
