import {
  getBalancedRoomLists,
  mapRoomsToCleaningTimes,
  sumCleaningTime,
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

describe('sumCleaningTime', () => {
  it('should calculate the sum cleaningTime for a list of rooms', () => {
    const roomsMap = mapRoomsToCleaningTimes(rooms);
    const result = sumCleaningTime(roomsMap);
    const expectedSum = 1350;

    expect(result).toBe(expectedSum);
  });
});

describe('getBalancedRoomLists', () => {
  it('should distribute all the rooms between two cleaners', () => {
    const { roomsListA, roomsListB } = getBalancedRoomLists(rooms);
    const roomsA = [...roomsListA.keys()];
    const roomsB = [...roomsListB.keys()];

    expect(
      rooms.every(
        (room) => roomsA.includes(room[0]) || roomsB.includes(room[0])
      )
    ).toBe(true);
  });

  it('should only assign a room to one cleaner (no duplicate assignments)', () => {
    const { roomsListA, roomsListB } = getBalancedRoomLists(rooms);
    const roomsA = [...roomsListA.keys()];
    const roomsB = [...roomsListB.keys()];

    const uniqueRoomsA = [
      '101',
      '102',
      '103',
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
      '114',
      '115',
      '116',
      '117',
      '201',
    ];
    const uniqueRoomsB = [
      '202',
      '203',
      '204',
      '205',
      '206',
      '207',
      '208',
      '209',
      '210',
      '211',
      '212',
      '213',
      '214',
      '215',
      '216',
    ];

    uniqueRoomsA.forEach((room) => {
      expect(roomsA.includes(room)).toBeTruthy();
      expect(roomsB.includes(room)).toBeFalsy();
    });

    uniqueRoomsB.forEach((room) => {
      expect(roomsB.includes(room)).toBeTruthy();
      expect(roomsA.includes(room)).toBeFalsy();
    });

    const allRooms = [...roomsA, ...roomsB];
    const uniqueRooms = new Set(allRooms);
    expect(uniqueRooms.size).toBe(allRooms.length);
  });

  it('should equally divide the room cleaningTimes if possible', () => {
    const roomsWithEquallyDistributableCleaningTimes = [
      ['101', 'OBS'],
      ['102', 'ODB'],
      ['103', 'ODS'],
      ['104', 'ODS'],
      ['202', 'DDS'],
      ['203', 'OC1'],
      ['207', 'DDY'],
      ['210', 'QDY'],
      ['211', 'DBS'],
      ['212', 'QDB'],
      ['213', 'QDS'],
      ['214', 'QC1'],
      ['215', 'DDY'],
    ];

    const { roomsListA, roomsListB } = getBalancedRoomLists(
      roomsWithEquallyDistributableCleaningTimes
    );

    const totalCleaningTimeCleanerA = sumCleaningTime(roomsListA);
    const totalCleaningTimeCleanerB = sumCleaningTime(roomsListB);

    expect(totalCleaningTimeCleanerA).toEqual(totalCleaningTimeCleanerB);
  });

  it('should handle a totalCleaningTime that cannot be equally divided', () => {
    const rooms = [
      ['101', 'OBS'],
      ['102', 'ODB'],
      ['103', 'ODS'],
      ['104', 'ODS'],
      ['105', 'QBS'],
      ['202', 'DDS'],
      ['203', 'OC1'],
      ['207', 'DDY'],
      ['210', 'QDY'],
      ['211', 'DBS'],
      ['212', 'QDB'],
      ['213', 'QDS'],
      ['214', 'QC1'],
      ['215', 'DDY'],
      // An odd number of stays will produce a total cleaningTime that can never be equally divided in half
      ['218', 'DBI', 'available', 'stay'],
    ];
    const { roomsListA, roomsListB } = getBalancedRoomLists(rooms);

    const totalCleaningTimeCleanerA = sumCleaningTime(roomsListA);
    const totalCleaningTimeCleanerB = sumCleaningTime(roomsListB);

    const oddNumberedTotalCleaningTime =
      totalCleaningTimeCleanerA + totalCleaningTimeCleanerB;

    expect(oddNumberedTotalCleaningTime % 2 == 1).toBeTruthy();
    expect(totalCleaningTimeCleanerA).not.toEqual(totalCleaningTimeCleanerB);
  });

  it('should minimize the cleaningTime difference between both cleaners', () => {
    const rooms = [
      ['101', 'O'],
      ['102', 'O'],
      ['103', 'Q'],
      ['104', 'Q'],
      ['105', 'Q'],
      ['106', 'Q'],
      ['107', 'D'],
      ['108', 'DBI', 'available', 'stay'],
      ['109', 'DBI', 'available', 'stay'],
      ['110', 'DBI', 'available', 'stay'],
    ];

    const { roomsListA, roomsListB } = getBalancedRoomLists(rooms);
    const acceptedMarginOfDifference = 30;

    const totalCleaningTimeCleanerA = sumCleaningTime(roomsListA);
    const totalCleaningTimeCleanerB = sumCleaningTime(roomsListB);

    const timeDifference = Math.abs(
      totalCleaningTimeCleanerA - totalCleaningTimeCleanerB
    );

    expect(timeDifference).toBeLessThanOrEqual(acceptedMarginOfDifference);
  });

  // it(should give most rooms on one floor to the same cleaner)
});
