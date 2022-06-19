const yup = require('yup');

const debug = require('./debug')('convertNumber');
const { keywordsMissing } = require('./keywordsMissing');
const reduceProps = require('./reduceProps');
const convertString = require('./convertString');

module.exports = (jsonSchema, yupSchema) => {
  if (jsonSchema.regex || jsonSchema.regexFrontend) {
    return convertString(jsonSchema);
  }

  // debug('Init');
  return reduceProps(
    jsonSchema,
    yup.isSchema(yupSchema) ? yupSchema : yup.number(),
    (yupAcc, propKey) => {
      switch (propKey) {
        default:
          keywordsMissing.number.push(propKey);
          break;
      }

      return yupAcc;
    }
  );
};
