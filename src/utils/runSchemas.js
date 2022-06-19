const getValues = require('./getValues');
const validate = require('./validate');
const log = require('./log');
const debug = require('./debug')('runSchemas');

const defValues = getValues();

module.exports = (id, schemas, values = defValues) => {
  const results = schemas.map((schema) => {
    return validate({ _id: schema._id ?? '', ...schema }, values);
  });
  log(debug.extend(id), values, results);
};
