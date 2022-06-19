const schemaObj = require('./schema.json');
const convertToYup = require('../../utils/convertToYup');
const debug = require('./debug')('yup');

module.exports = async (value) => {
  debug('Init');
  const schema = convertToYup(schemaObj);
  try {
    const result = await schema.validate(value, { abortEarly: false });
    debug('Valid!!!');
    result.dateOfArrival = Number(result.dateOfArrival.replace(/\//gi, ''));
    result.timeOfArrival = Number(result.timeOfArrival.replace(/:/gi, ''));
    // debug({
    //   dateOfArrival: result.dateOfArrival,
    //   timeOfArrival: result.timeOfArrival,
    // });

    return result;
  } catch (err) {
    debug({ name: err.name, errors: err.errors });
  }

  return undefined;
};
