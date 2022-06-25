import set from 'lodash/set';

import schemaObj from './schema.json';
import convertToYup from '../../utils/convertToYup';
import getDebug from './debug';

const debug = getDebug('yup');

export default async (value) => {
  debug('Init');
  const schema = convertToYup(schemaObj);
  try {
    // debug(schema.describe());
    const valuesFix = { ...value };
    delete valuesFix.send;
    delete valuesFix.HBOLNumber;
    delete valuesFix.htsDescription;
    delete valuesFix.productFlags;
    delete valuesFix.htsCode0;
    delete valuesFix.manufacturerName;
    const result = await schema.validate(valuesFix, { abortEarly: false });
    debug('Valid!!!');
    if (result?.dateOfArrival)
      result.dateOfArrival = Number(result.dateOfArrival.replace(/\//gi, ''));
    if (result?.timeOfArrival)
      result.timeOfArrival = Number(result.timeOfArrival.replace(/:/gi, ''));

    return result;
  } catch (err) {
    // debug({ err });
    if (err.name !== 'ValidationError') {
      throw err;
    }

    // return error.errors;
    const message = err.inner.reduce((errors, currentError) => {
      return set(errors, currentError.path, currentError.message);
    }, {});
    debug(JSON.stringify(message));
    // throw err;
  }
};
