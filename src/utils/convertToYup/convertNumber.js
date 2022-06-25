import yup from 'yup';

import getDebug from './debug';
import keywordsMissing from './keywordsMissing';
import reduceProps from './reduceProps';
import convertString from './convertString';

const debug = getDebug('convertNumber');

export default (jsonSchema, yupSchema) => {
  if (jsonSchema.regex || jsonSchema.regexFrontend) {
    const schemaString = { ...jsonSchema };
    delete schemaString.minLength;
    delete schemaString.maxLength;
    delete schemaString.length;

    return convertString(schemaString);
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
