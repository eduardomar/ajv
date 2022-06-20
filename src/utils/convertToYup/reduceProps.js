const { keywordsMissing } = require('./keywordsMissing');
const debug = require('./debug')('reduceProps');

const lastItems = ['allOf', 'oneOf', 'anyOf', 'items'];

module.exports = (jsonSchema, yupSchema, cb) => {
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
    // if (index === entries.length - 1) debug('Last ::> %s', propKey);
    // return cb(yupAcc, propKey, propValue);

    switch (propKey) {
      // Fields to ignore
      case '$id':
      case '$ref':
      case 'type':
      case 'description':
      case 'descriptionFrontend':
      case 'fieldNoDashesAndDots':
      case 'fieldTrim':
      case 'title':
      case 'additionalItems':
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
        }
        const num = parseInt(propValue, 10);

        // debug({ key, funcName, num });
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
