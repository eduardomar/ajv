// The data is valid if it is valid according to all JSON Schemas in this array.
import runSchemas from '../utils/runSchemas';

const schemas = [
  {
    type: 'number',
    maximum: 3,
  },
  {
    type: 'integer',
  },
  {
    type: 'number',
    allOf: [{ maximum: 3 }, { type: 'integer' }],
  },
];

export default () => runSchemas('allOf', schemas);
