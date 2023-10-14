import {
  getBalancedRoomLists,
  mapSpecificCleaningTimeToEachRoomBasedOnOccupancyState,
  sumCleaningTime,
} from './getBalancedRoomLists';

const rooms = [
  ['101', 'DBS', 'till 12.08', 'U', 'departure'],
  ['102', 'QDB', 'available', 'U', 'departure'],
  ['103', 'QDS', 'available', 'U', 'departure'],
  ['104', 'DBS', 'available', 'U', 'departure'],
  ['105', 'DBS', 'available', 'U', 'departure'],
  ['106', 'DBS', 'available', 'U', 'departure'],
  ['107', 'DBV', 'till 12.08', 'U', 'departure'],
  ['108', 'DBI', 'available', 'U', 'departure'],
  ['109', 'DBI', 'till 12.08', 'U', 'departure'],
  ['110', 'DBI', 'available', 'U', 'departure'],
  ['111', 'DBI', 'till 12.08', 'U', 'departure'],
  ['112', 'DBI', 'available', 'U', 'departure'],
  ['113', 'DBI', 'available', 'U', 'departure'],
  ['114', 'QDA', 'till 12.08', 'U', 'departure'],
  ['115', 'QDA', 'till 12.08', 'U', 'departure'],
  ['116', 'DBA', 'available', 'U', 'departure'],
  ['117', 'DBI', 'available', 'U', 'departure'],
  ['201', 'DBB', 'available', 'U', 'departure'],
  ['202', 'QDS', 'available', 'U', 'departure'],
  ['203', 'OC1', 'available', 'U', 'departure'],
  ['204', 'OC2', 'available', 'U', 'departure'],
  ['205', 'DBN', 'available', 'U', 'departure'],
  ['206', 'DBN', 'till 13.08', 'U', 'departure'],
  ['207', 'DDY', 'available', 'U', 'departure'],
  ['208', 'DDY', 'till 13.08', 'U', 'departure'],
  ['209', 'DDY', 'available', 'U', 'departure'],
  ['210', 'DDY', 'available', 'U', 'departure'],
  ['211', 'DDY', 'till 13.08', 'U', 'departure'],
  ['212', 'DDY', 'available', 'U', 'departure'],
  ['213', 'DDY', 'till 14.08', 'U', 'departure'],
  ['214', 'QDY', 'available', 'U', 'departure'],
  ['215', 'DDY', 'till 15.08', 'U', 'departure'],
  ['216', 'DDY', 'available', 'U', 'departure'],
];

describe('sumCleaningTime', () => {
  it('should calculate the sum cleaningTime for a list of rooms', () => {
    const roomsMap =
      mapSpecificCleaningTimeToEachRoomBasedOnOccupancyState(rooms);
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
    // we must account for the extra entry which is appended to the list of rooms: 'Total Cleaning Time'
    expect(uniqueRooms.size).toBe(allRooms.length - 1);
  });

  it('should equally divide the room cleaningTimes if possible', () => {
    const roomsWithEquallyDistributableCleaningTimes = [
      ['101', 'OBS', 'till 12.08', 'U', 'departure'],
      ['102', 'ODB', 'till 12.08', 'U', 'departure'],
      ['103', 'ODS', 'till 12.08', 'U', 'departure'],
      ['104', 'ODS', 'till 12.08', 'U', 'departure'],
      ['202', 'DDS', 'till 12.08', 'U', 'departure'],
      ['203', 'OC1', 'till 12.08', 'U', 'departure'],
      ['207', 'DDY', 'till 12.08', 'U', 'departure'],
      ['210', 'QDY', 'till 12.08', 'U', 'departure'],
      ['211', 'DBS', 'till 12.08', 'U', 'departure'],
      ['212', 'QDB', 'till 12.08', 'U', 'departure'],
      ['213', 'QDS', 'till 12.08', 'U', 'departure'],
      ['214', 'QC1', 'till 12.08', 'U', 'departure'],
      ['215', 'DDY', 'till 12.08', 'U', 'departure'],
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
      ['101', 'OBS', 'till 12.08', 'U', 'departure'],
      ['102', 'ODB', 'till 12.08', 'U', 'departure'],
      ['103', 'ODS', 'till 12.08', 'U', 'departure'],
      ['104', 'ODS', 'till 12.08', 'U', 'departure'],
      ['105', 'QBS', 'till 12.08', 'U', 'departure'],
      ['202', 'DDS', 'till 12.08', 'U', 'departure'],
      ['203', 'OC1', 'till 12.08', 'U', 'departure'],
      ['207', 'DDY', 'till 12.08', 'U', 'departure'],
      ['210', 'QDY', 'till 12.08', 'U', 'departure'],
      ['211', 'DBS', 'till 12.08', 'U', 'departure'],
      ['212', 'QDB', 'till 12.08', 'U', 'departure'],
      ['213', 'QDS', 'till 12.08', 'U', 'departure'],
      ['214', 'QC1', 'till 12.08', 'U', 'departure'],
      ['215', 'DDY', 'till 12.08', 'U', 'departure'],
      ['218', 'DBI', 'available', 'U', 'stay'],
    ];
    const { roomsListA, roomsListB } = getBalancedRoomLists(rooms);

    const totalCleaningTimeCleanerA = sumCleaningTime(roomsListA);
    const totalCleaningTimeCleanerB = sumCleaningTime(roomsListB);

    expect(totalCleaningTimeCleanerA).not.toEqual(totalCleaningTimeCleanerB);
  });

  it('should minimize the cleaningTime difference between both cleaners', () => {
    const rooms = [
      ['101', 'O', 'till 12.08', 'U', 'departure'],
      ['102', 'O', 'till 12.08', 'U', 'departure'],
      ['103', 'Q', 'till 12.08', 'U', 'departure'],
      ['104', 'Q', 'till 12.08', 'U', 'departure'],
      ['105', 'Q', 'till 12.08', 'U', 'departure'],
      ['106', 'Q', 'till 12.08', 'U', 'departure'],
      ['107', 'D', 'till 12.08', 'U', 'departure'],
      ['108', 'DBI', 'available', 'U', 'stay'],
      ['109', 'DBI', 'available', 'U', 'stay'],
      ['110', 'DBI', 'available', 'U', 'stay'],
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
