// The data is valid if it matches exactly one JSON Schema from this array
const runSchemas = require('../utils/runSchemas');

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
    _id: 'Is a decimal number less than or equal to 3 or is an integer',
    type: 'number',
    oneOf: [{ maximum: 3 }, { type: 'integer' }],
  },
];

module.exports = () => runSchemas('oneOf', schemas);
