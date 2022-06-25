import getDebug from './debug';
import convert from './convert';
import * as keywordsMissing from './keywordsMissing';

const debug = getDebug();

export default (jsonSchema) => {
  // debug('Init');
  keywordsMissing.clear();

  if (!jsonSchema) return null;

  const yupSchema = convert(jsonSchema);
  // debug('describe', yupSchema?.describe?.());
  // debug(keywordsMissing.get());
  // return JSON.parse(JSON.stringify(keywordsMissing.get()));
  return yupSchema;
};
