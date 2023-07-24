// we loop through entire workbook, separating 'availables' from till '{{date}}'
const DURATION_CODES = {
  Q: 30,
  D: 60,
  O: 120,
};

// this data will come from the spreadsheet
const availableRooms = {
  // room# is one column, room key is the next
  101: 'DBS',
  102: 'QDB',
  103: 'QDS',
  203: 'OC1',
  207: 'DDY',
  210: 'DDY',
  211: 'DBS',
  212: 'QDB',
  213: 'QDS',
  214: 'OC1',
  215: 'DDY',
  216: 'DDY',
};

const occupiedRooms = {
  // we just need room numbers, because all durations for occupied rooms will be 15
};

const roomsMap = new Map();

let totalCleaningDurationMinutes = 0;

// function getTotalDuration() {

// }

for (const [roomNumber, durationCode] of Object.entries(availableRooms)) {
  // we only need the first letter of the code
  roomsMap.set(roomNumber, durationCode[0]);
  // console.log(roomNumber, durationCode[0], DURATION_CODES[durationCode[0]]);
  totalCleaningDurationMinutes =
    totalCleaningDurationMinutes + DURATION_CODES[durationCode[0]];
}

const halfOftotalCleaningDurationMinutes = Math.floor(
  totalCleaningDurationMinutes / 2
);

let cleanerA = new Map();
cleanerA.set('totalDurationForOneCleaner', 0);
let cleanerB = new Map();
cleanerB.set('totalDurationForOneCleaner', 0);

// while the total duration mins is < halfOftotalCleaningDurationMinutes
// add the room, in order, to the cleaner A
// if it gets to a point where its like at 330, max is 360, but next room is 120, skip room until it gets to one it can add to reach 360

for (const [key, val] of roomsMap) {
  const durationOfRoom = DURATION_CODES[val];

  if (
    cleanerA.get('totalDurationForOneCleaner') <
    halfOftotalCleaningDurationMinutes
    // and adding the current room will not exceed the half
  ) {
    cleanerA.set(key, durationOfRoom);

    cleanerA.set(
      'totalDurationForOneCleaner',
      cleanerA.get('totalDurationForOneCleaner') + durationOfRoom
    );
  }
}

for (const [key, val] of roomsMap) {
  const durationOfRoom = DURATION_CODES[val];

  if (!cleanerA.has(key)) {
    cleanerB.set(key, durationOfRoom);
    cleanerB.set(
      'totalDurationForOneCleaner',
      cleanerB.get('totalDurationForOneCleaner') + durationOfRoom
    );
  }
}

console.log({ cleanerA, cleanerB });
