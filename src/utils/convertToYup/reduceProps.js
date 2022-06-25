import { keywordsMissing } from './keywordsMissing';
import getDebug from './debug';

const { log, error } = getDebug('reduceProps');
const lastItems = ['allOf', 'oneOf', 'anyOf', 'items'];

export default (jsonSchema, yupSchema, cb) => {
  const entries = Object.entries(jsonSchema ?? {}).sort(([a], [b]) => {
    const result = lastItems.reduce((acc, field) => {
      if (acc === 0) {
        if (a === field) return 1;
        if (b === field) return -1;
      }

      return acc;
    }, 0);
    if (result !== 0) return result;

    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
  });

  // yupSchema.meta(jsonSchema);
  return entries.reduce((yupAcc, [propKey, propValue]) => {
    // if (index === entries.length - 1) log('Last ::> %s', propKey);
    // return cb(yupAcc, propKey, propValue);

    switch (propKey) {
      // Fields to ignore
      case '$id':
      case '$ref':
      case '$schema':
      case 'additionalItems':
      case 'description':
      case 'descriptionFrontend':
      case 'fieldAddZero':
      case 'fieldConvertStateName':
      case 'fieldFormatter':
      case 'fieldNoDashesAndDots':
      case 'fieldNoSpaces':
      case 'fieldRound':
      case 'fieldStartZero':
      case 'fieldSubstring':
      case 'fieldTrim':
      case 'fieldTrimStartEnd':
      case 'fieldUpperCase':
      case 'title':
      case 'type':
        keywordsMissing.ignored.push(propKey);
        break;

      case 'length':
      case 'minLength':
      case 'maxLength':
      case 'minItems':
      case 'maxItems':
      case 'minimum':
      case 'maximum': {
        let funcName = propKey;
        if (['minLength', 'minItems', 'minimum'].includes(propKey)) {
          funcName = 'min';
        } else if (['maxLength', 'maxItems', 'maximum'].includes(propKey)) {
          funcName = 'max';
        } else {
          funcName = 'length';
        }

        const num = parseInt(propValue, 10);

        // log({ key, funcName, num });
        if (Number.isInteger(num) && yupAcc?.[funcName]) {
          return yupAcc[funcName](num);
        }
        break;
      }

      case 'const': {
        const fixValue = propValue?.length
          ? propValue
          : parseInt(propValue, 10);
        if (fixValue?.length || Number.isInteger(fixValue))
          return yupAcc.oneOf([fixValue]);
        break;
      }

      default:
        return cb?.(yupAcc, propKey, propValue) ?? yupAcc;
    }

    return yupAcc;
  }, yupSchema);
};
