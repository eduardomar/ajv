import getValues from './getValues';
import validate from './validate';
import log from './log';
import getDebug from './debug';

const debug = getDebug('runSchemas');
const defValues = getValues();

export default (id, schemas, values = defValues) => {
  const results = schemas.map((schema) => {
    return validate({ _id: schema._id ?? '', ...schema }, values);
  });
  log(debug.extend(id), values, results);
};
