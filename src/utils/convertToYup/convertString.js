const debug = require('./debug')('convertString');
const yup = require('yup');
const { keywordsMissing } = require('./keywordsMissing');
const reduceProps = require('./reduceProps');

module.exports = (jsonSchema, yupSchema) => {
  // debug('Init');
  if (jsonSchema.regexFrontend) {
    delete jsonSchema.regex;
  }

  return reduceProps(
    jsonSchema,
    yup.isSchema(yupSchema) ? yupSchema : yup.string(),
    (yupAcc, propKey, propValue) => {
      switch (propKey) {
        case 'enum':
          const fixValue = Array.isArray(propValue) ? propValue : [propValue];
          return yupAcc.oneOf(fixValue);

        case 'regex':
        case 'regexFrontend':
          return yupAcc.matches(propValue);

        default:
          keywordsMissing.string.push(propKey);
          break;
      }

      return yupAcc;
    }
  );
};
