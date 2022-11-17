import getDebug from './debug';
import jsonSchema from './jsonSchema';
import value from './value.json' assert { type: 'json' };
import yup from './yup';

const debug = getDebug();

const standAlonePN = async () => {
  debug('Init');

  const result = await yup(value);
  if (result) {
    // debug({ packaging: result.packaging });
    jsonSchema(value);
  }
};

export default standAlonePN;
