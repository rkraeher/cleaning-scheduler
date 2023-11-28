import {
  getBalancedRoomLists,
  convertHoursAndMinutesToMinutes,
} from './getBalancedRoomLists';

describe('getBalancedRoomLists', () => {
  const sampleData = [
    ['101', 'DBS', 'do 9.10', 'U', 'departure'],
    ['102', 'QDB', 'do 09.10', 'U', 'departure'],
    ['103', 'QDS', 'do 09.10', 'U', 'departure'],
    ['104', 'DBS', 'do 10.10', 'U', 'departure'],
    ['105', 'DBS', 'do 10.10', 'U', 'departure'],
    ['106', 'DBS', 'do 11.10', 'U', 'departure'],
    ['107', 'DBV', 'do 11.10', 'U', 'departure'],
    ['108', 'DBI', 'do 11.10', 'U', 'departure'],
    ['109', 'DBI', 'volný', 'U', 'vacant'],
    ['110', 'DBI', 'volný', 'U', 'vacant'],
    ['111', 'DBI', 'volný', 'U', 'vacant'],
    ['112', 'DBI', 'volný', 'U', 'vacant'],
    ['113', 'DBI', 'volný', 'U', 'vacant'],
    ['114', 'QDA', 'volný', 'U', 'vacant'],
    ['115', 'QDA', 'volný', 'U', 'vacant'],
    ['116', 'DBA', 'volný', 'U', 'vacant'],
    ['117', 'DBI', 'volný', 'U', 'vacant'],
    ['201', 'DBB', 'volný', 'U', 'vacant'],
    ['202', 'QDS', 'volný', 'U', 'vacant'],
    ['203', 'OC1', 'volný', 'U', 'vacant'],
    ['204', 'OC2', 'volný', 'U', 'vacant'],
    ['205', 'DBN', 'volný', 'N', 'departure'],
    ['206', 'DBN', 'volný', 'U', 'vacant'],
    ['207', 'DDY', 'volný', 'U', 'vacant'],
    ['208', 'DDY', 'volný', 'U', 'vacant'],
    ['209', 'DDY', 'volný', 'U', 'vacant'],
    ['210', 'DDY', 'volný', 'U', 'vacant'],
    ['211', 'DDY', 'volný', 'U', 'vacant'],
    ['212', 'DDY', 'volný', 'U', 'vacant'],
    ['213', 'DDY', 'volný', 'U', 'vacant'],
    ['214', 'QDY', 'available', 'N', 'departure'],
    ['215', 'DDY', 'available', 'U', 'vacant'],
    ['216', 'DDY', 'available', 'U', 'vacant'],
  ];

  it('distributes all the rooms between two cleaners', () => {
    const { roomsListA, roomsListB } = getBalancedRoomLists(sampleData);

    // Check if all rooms from the input data are assigned to either roomsListA or roomsListB
    sampleData.forEach((roomData) => {
      const roomNumber = roomData[0];
      const isAssigned =
        roomsListA.rooms.some((room) => room.roomNumber === roomNumber) ||
        roomsListB.rooms.some((room) => room.roomNumber === roomNumber);
      expect(isAssigned).toBe(true);
    });
  });

  it('only assigns a room to one cleaner (no duplicate assignments)', () => {
    const { roomsListA, roomsListB } = getBalancedRoomLists(sampleData);

    // Check if there are no duplicate assignments
    const commonRooms = roomsListA.rooms.filter((room) =>
      roomsListB.rooms.includes(room)
    );
    expect(commonRooms.length).toBe(0);
  });

  it('minimizes the cleaning time difference between both cleaners', () => {
    const { roomsListA, roomsListB } = getBalancedRoomLists(sampleData);

    const difference = Math.abs(
      convertHoursAndMinutesToMinutes(roomsListA.totalCleaningTime) -
        convertHoursAndMinutesToMinutes(roomsListB.totalCleaningTime)
    );

    expect(difference).toBeLessThanOrEqual(30);
  });
});
