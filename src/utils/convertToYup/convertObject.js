const debug = require('./debug')('convertObject');
const yup = require('yup');
const { keywordsMissing } = require('./keywordsMissing');
const reduceProps = require('./reduceProps');
const convert = require('./convert'); // ← No se porque aqui

module.exports = ({ required, ...jsonSchema }, yupSchema) => {
  // debug('Init');
  return reduceProps(
    jsonSchema,
    yup.isSchema(yupSchema) ? yupSchema : yup.object(),
    (yupAcc, propKey, propValue) => {
      // debug({ propKey, propValue: !!propValue });
      switch (propKey) {
        case 'properties':
          const yupSchemasFields = Object.entries(propValue ?? {})
            .filter(
              (item) =>
                item &&
                item.length === 2 &&
                item[0].length &&
                Object.keys(item[1] ?? {}).length
            )
            .map(([key, value]) => {
              return [
                key,
                convert(
                  value,
                  null,
                  required?.includes?.(key) ? { required: null } : {}
                ),
              ];
            })
            .filter(([_, value]) => yup.isSchema(value));

          if (yupSchemasFields?.length) {
            return yupAcc.shape(Object.fromEntries(yupSchemasFields));
          }
          break;

        default:
          keywordsMissing.object.push(propKey);
          break;
      }

      return yupAcc;
    }
  );
};
