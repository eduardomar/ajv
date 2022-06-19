const debug = require('./debug')('convertArray');
const yup = require('yup');
const { keywordsMissing } = require('./keywordsMissing');
const reduceProps = require('./reduceProps');
const convert = require('./convert');

module.exports = (jsonSchema, yupSchema) => {
  // debug('Init');
  return reduceProps(
    jsonSchema,
    yup.isSchema(yupSchema) ? yupSchema : yup.array(),
    (yupAcc, propKey, propValue) => {
      // debug('%s %s', propKey, yupAcc.type);
      switch (propKey) {
        case 'items':
          if (propValue) {
            if (Array.isArray(propValue)) {
              debug('isArray');
            } else {
              // debug({ propValue });
              if (!propValue.type) {
                let fixProps = { ...propValue };
                if (fixProps.properties) {
                  fixProps.type = 'object';
                } else if (Object.keys(fixProps).length) {
                  fixProps = {
                    type: 'object',
                    properties: fixProps,
                  };
                }

                if (fixProps.type.length) return yupAcc.of(convert(fixProps));
              } else return yupAcc.of(convert(propValue));
            }
          }
          break;

        default:
          keywordsMissing.array.push(propKey);
          break;
      }

      return yupAcc;
    }
  );
};
