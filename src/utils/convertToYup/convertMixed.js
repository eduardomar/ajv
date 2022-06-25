import * as Yup from 'yup';

import getDebug from './debug';
import { keywordsMissing } from './keywordsMissing';
import reduceProps from './reduceProps';

const { log, error } = getDebug('convertMixed');

export default (jsonSchema, yupSchema) => {
  // log('Init');
  return reduceProps(
    jsonSchema,
    Yup.isSchema(yupSchema) ? yupSchema : Yup.mixed(),
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
