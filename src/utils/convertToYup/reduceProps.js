const { keywordsMissing } = require('./keywordsMissing');

module.exports = (jsonSchema, yupSchema, cb) => {
  const entries = Object.entries(jsonSchema ?? {});
  // yupSchema.meta(jsonSchema);
  return entries.reduce((yupAcc, [propKey, propValue]) => {
    // return cb(yupAcc, propKey, propValue);
    switch (propKey) {
      // Fields to ignore
      case '$id':
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
      case 'maximum':
        const funcName = ['minLength', 'minItems', 'minimum'].includes(propKey)
          ? 'min'
          : ['maxLength', 'maxItems', 'maximum'].includes(propKey)
          ? 'max'
          : propKey;
        const num = parseInt(propValue);

        // debug({ key, funcName, num });
        if (Number.isInteger(num) && yupAcc?.[funcName]) {
          return yupAcc[funcName](num);
        }
        break;

      case 'const':
        const fixValue = propValue?.length ? propValue : parseInt(propValue);
        if (fixValue?.length || Number.isInteger(fixValue))
          return yupAcc.oneOf([fixValue]);

      default:
        return cb(yupAcc, propKey, propValue);
    }

    return yupAcc;
  }, yupSchema);
};
