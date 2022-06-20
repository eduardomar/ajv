const yup = require('yup');

const debug = require('./debug')('convertMixed');
const { keywordsMissing } = require('./keywordsMissing');
const reduceProps = require('./reduceProps');

module.exports = (jsonSchema, yupSchema) => {
  // debug('Init');
  return reduceProps(
    jsonSchema,
    yup.isSchema(yupSchema) ? yupSchema : yup.mixed(),
    (yupAcc, propKey) => {
      switch (propKey) {
        default:
          keywordsMissing.mixed.push(propKey);
          break;
      }

      return yupAcc;
    }
  );
};
