import value from './value.json';
import getDebug from './debug';
import yup from './yup';
import jsonSchema from './jsonSchema';

const debug = getDebug();

export default async () => {
  debug('init');

  const result = await yup(value);
  if (result) {
    // debug({ packaging: result.packaging });
    jsonSchema(value);
  }
};
