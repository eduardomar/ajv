const debug = require('./debug')();
const convert = require('./convert');
const keywordsMissing = require('./keywordsMissing');

module.exports = (jsonSchema) => {
  // debug('Init');
  keywordsMissing.clear();

  if (!jsonSchema) return null;

  const yupSchema = convert(jsonSchema);
  // debug('describe', yupSchema?.describe?.());
  debug(keywordsMissing.get());
  return yupSchema;
};
