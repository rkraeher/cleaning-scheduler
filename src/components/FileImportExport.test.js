import { isNumberAsString, parseRow, parseRows } from './FileImportExport';

describe('isNumberAsString', () => {
  it('should return true for a valid number string', () => {
    expect(isNumberAsString('123')).toBe(true);
    expect(isNumberAsString('-45')).toBe(true);
  });

  it('should return false for a non-numeric string', () => {
    expect(isNumberAsString('abc')).toBe(false);
    expect(isNumberAsString('12.34a')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isNumberAsString('')).toBe(false);
  });
});

describe('parseRow', () => {
  it('should parse the row and filter out irrelevant cells', () => {
    const inputRow = ['101', 'DAB', 'Q', 'available', 'till 3.6', 'EFG', 123];
    const parsedRow = ['101', 'DAB', 'available', 'till 3.6'];
    expect(parseRow(inputRow)).toEqual(parsedRow);
  });

  it('should return an empty array for an empty row', () => {
    const row = [];
    expect(parseRow(row)).toEqual([]);
  });
});

describe('parseRows', () => {
  it('should parse the rows and return an array of parsed rows', () => {
    const input = [
      ['101', 'DAB', 'P', 'till 3.6', 'EFG', 123],
      ['201', 'OC1', 'available', 'XYZ', 456],
    ];

    const output = [
      ['101', 'DAB', 'till 3.6'],
      ['201', 'OC1', 'available'],
    ];
    expect(parseRows(input)).toEqual(output);
  });

  it('should handle empty rows and return an array of parsed rows', () => {
    const inputData = [[], ['123', 'OC1', 'till 26.6', 'XYZ']];
    const outputData = [['123', 'OC1', 'till 26.6']];
    expect(parseRows(inputData)).toEqual(outputData);
  });

  it('should handle invalid data and return an empty array', () => {
    const data = [
      [1, 'DAB', 'Q', 'till 3.6', 'EFG', '123'],
      [201, '123', 'OC', 'invalid', '26.6', 'XYZ', '456'],
      ['', 'DQC'],
    ];
    expect(parseRows(data)).toEqual([]);
  });
});

// TODO add tests for addAvailabilityStatusToRooms
// Consider the failing cases and bad date - we should elegantly handle when the input causes the program to crash
