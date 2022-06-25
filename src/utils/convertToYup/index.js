import getDebug from './debug';
import * as keywordsMissing from './keywordsMissing';
import convert from './convert';

const { log, error } = getDebug();

export default (jsonSchema) => {
  // log("Init");
  keywordsMissing.clear();

  if (!jsonSchema) return null;

  const yupSchema = convert(jsonSchema);

  // log('describe', yupSchema?.describe?.());
  log(keywordsMissing.get());
  return yupSchema;
};
