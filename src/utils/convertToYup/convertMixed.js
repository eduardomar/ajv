import yup from 'yup';

import getDebug from './debug';
import keywordsMissing from './keywordsMissing';
import reduceProps from './reduceProps';

const debug = getDebug('convertMixed');

export default (jsonSchema, yupSchema) => {
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
