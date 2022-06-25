// The data is valid if it is valid according to one or more JSON Schemas in this array.
import runSchemas from '../utils/runSchemas';

const schemas = [
  {
    _id: 'Is a number',
    type: 'number',
  },
  {
    _id: 'Is a number less than or equal to 3',
    type: 'number',
    maximum: 3,
  },
  {
    _id: 'Is an integer',
    type: 'integer',
  },
  {
    _id: 'Is a number less than or equal to 3 or is an integer greater than 3',
    type: 'number',
    anyOf: [{ maximum: 3 }, { type: 'integer' }],
  },
];

export default () => runSchemas('anyOf', schemas);
