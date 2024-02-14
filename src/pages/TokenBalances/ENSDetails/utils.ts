import { capitalizeFirstLetter } from '../../../utils';
import { RecordType } from './types';

// Map used for identifying primary records and assigning correct keys
const primaryRecordKeyMap: Record<string, string> = {
  description: 'Description',
  url: 'Website',
  location: 'Location',
  email: 'Email',
  phone: 'Phone',
  'vnd.twitter': 'Twitter',
  'com.twitter': 'Twitter',
  'org.telegram': 'Telegram',
  'com.linkedin': 'LinkedIn',
  'vnd.github': 'GitHub',
  'com.github': 'GitHub',
  'vnd.peepeth': 'Peepeth',
  'com.peepeth': 'Peepeth',
  'io.keybase': 'Keybase'
};

// Map used for deciding the position of primary records
const primaryRecordPosMap: Record<string, number> = {
  Description: 1,
  Website: 2,
  Location: 3,
  Email: 4,
  Phone: 5,
  Twitter: 6,
  Telegram: 7,
  LinkedIn: 9,
  GitHub: 10,
  Peepeth: 11,
  Keybase: 12
};

// Processes an array of records, grouping them into primary and other records.
export function processRecords(records: RecordType[]) {
  const primaryRecordObj: Record<string, RecordType> = {}; // For storing primary records with their positions as keys
  const otherRecords: RecordType[] = [];

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    // Ignore avatar key, as same field is already used
    if (record.key === 'avatar') {
      continue;
    }
    const primaryRecordKey = primaryRecordKeyMap[record.key];
    // If the record's key is part of the primary records
    if (primaryRecordKey) {
      const primaryRecordPos = primaryRecordPosMap[primaryRecordKey];
      // If the primary record position exists and is not filled
      if (primaryRecordPos && !primaryRecordObj[primaryRecordPos]) {
        primaryRecordObj[primaryRecordPos] = {
          key: primaryRecordKey,
          value: record.value
        };
      }
    } else {
      otherRecords.push({
        key: capitalizeFirstLetter(record.key),
        value: record.value
      });
    }
  }

  // Extract the values from the primaryRecordObj to get correctly positioned primary records
  const primaryRecords = Object.values(primaryRecordObj);

  return { primaryRecords, otherRecords };
}
