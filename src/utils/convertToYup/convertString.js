import yup from 'yup';

import getDebug from './debug';
import keywordsMissing from './keywordsMissing';
import reduceProps from './reduceProps';

const debug = getDebug('convertString');

export default (jsonSchema, yupSchema) => {
  // debug('Init');
  const schema = { ...jsonSchema };
  if (schema.regexFrontend) {
    delete schema.regex;
  }

  return reduceProps(
    schema,
    yup.isSchema(yupSchema) ? yupSchema : yup.string(),
    (yupAcc, propKey, propValue) => {
      switch (propKey) {
        case 'enum': {
          const fixValue = Array.isArray(propValue) ? propValue : [propValue];
          return yupAcc.oneOf(
            fixValue,
            // eslint-disable-next-line no-template-curly-in-string
            `${'${path}'} must be one of the following values: ${fixValue
              .map((value) => `${value}`)
              .join(', ')}`
          );
        }

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
