import * as Yup from 'yup';

import getDebug from './debug';
import { keywordsMissing } from './keywordsMissing';
import reduceProps from './reduceProps';
import convertString from './convertString';

const { log, error } = getDebug('convertNumber');

export default (jsonSchema, yupSchema) => {
  if (jsonSchema.regex || jsonSchema.regexFrontend) {
    const schemaString = { ...jsonSchema };
    delete schemaString.minLength;
    delete schemaString.maxLength;
    delete schemaString.length;

    return convertString(schemaString);
  }

  // log('Init');
  return reduceProps(
    jsonSchema,
    Yup.isSchema(yupSchema) ? yupSchema : Yup.number(),
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
