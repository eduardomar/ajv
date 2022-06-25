import schemaObj from './schema.json';
import convertToYup from '../../utils/convertToYup';
import getDebug from './debug';

const debug = getDebug('yup');

export default async (value) => {
  debug('Init');
  const schema = convertToYup(schemaObj);
  try {
    // debug(schema.describe());
    const result = await schema.validate(value, { abortEarly: false });
    debug('Valid!!!');
    if (result?.dateOfArrival)
      result.dateOfArrival = Number(result.dateOfArrival.replace(/\//gi, ''));
    if (result?.timeOfArrival)
      result.timeOfArrival = Number(result.timeOfArrival.replace(/:/gi, ''));

    return result;
  } catch (err) {
    // debug(err);
    debug({ name: err.name, errors: err.errors });
  }

  return undefined;
};
