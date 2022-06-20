const yup = require('yup');

const debug = require('./debug')('convertObject');
const { keywordsMissing } = require('./keywordsMissing');
const reduceProps = require('./reduceProps');
const convert = require('./convert');
const fixJsonSchemaProps = require('./fixJsonSchemaProps');

module.exports = ({ required, ...jsonSchema }, yupSchema) => {
  // debug('Init');
  return reduceProps(
    jsonSchema,
    yup.isSchema(yupSchema) ? yupSchema : yup.object().strict().noUnknown(true),
    (yupAcc, propKey, propValue) => {
      // debug({ propKey, propValue: !!propValue });
      switch (propKey) {
        case 'properties': {
          const yupSchemasFields = Object.entries(propValue ?? {})
            .filter(
              (item) =>
                item &&
                item.length === 2 &&
                item[0].length &&
                Object.keys(item[1] ?? {}).length
            )
            .map(([key, value]) => {
              const oldSchema = yupAcc?.fields?.[key]?.clone() ?? null;
              // debug({ key, value, fields: Object.keys(yupAcc?.fields) });
              return [
                key,
                convert(
                  { type: oldSchema?.type ?? value.type, ...value },
                  oldSchema,
                  required?.includes?.(key) ? { required: null } : {}
                ),
              ];
            })
            .filter(([, value]) => yup.isSchema(value));

          if (yupSchemasFields?.length) {
            return yupAcc.shape(Object.fromEntries(yupSchemasFields));
          }
          break;
        }

        case 'allOf': {
          const allOf = Array.isArray(propValue) ? propValue : [propValue];
          return allOf.reduce((yupAccAllOf, jsonSchemaAllOf, index) => {
            const schema = fixJsonSchemaProps(jsonSchemaAllOf, yupAcc);
            const yupSchemaAllOf = convert(schema)?.noUnknown(false);
            return yupAccAllOf
              .shape(
                Object.fromEntries(
                  Object.entries(yupSchemaAllOf.fields).map(
                    ([key, schemaField]) => {
                      return [key, yup?.[schemaField.type]?.()];
                    }
                  )
                )
              )
              .test(
                `all-of-${index}`,
                'object lalo',
                async (value, { path }) => {
                  // debug.extend(index)(yupSchemaAllOf.describe());
                  return yup
                    .object({ [path]: yupSchemaAllOf.clone() })
                    .validate({ [path]: value }, { abortEarly: false });
                }
              );
          }, yupAcc);
        }

        case 'anyOf': {
          const anyOf = Array.isArray(propValue) ? propValue : [propValue];
          const yupSchemasAnyOf = anyOf.map((jsonSchemaAnyOf) => {
            const schema = fixJsonSchemaProps(jsonSchemaAnyOf, yupAcc);
            // debug({ schema: JSON.stringify(schema, null, 2) });

            return convert(schema)?.noUnknown?.(false);
          });

          return yupAcc.test('one-of', async (arr, context) => {
            const { path, createError } = context;
            const results = await Promise.all(
              yupSchemasAnyOf.map(async (yupSchemaAnyOf) => {
                try {
                  // debug({ path, schema: yupSchemaAnyOf.describe() });
                  await yup
                    .object({ [path]: yupSchemaAnyOf.clone() })
                    .validate({ [path]: arr }, { abortEarly: false });
                  return true;
                } catch (err) {
                  // debug({ name: err.name, errors: err.errors });
                  return err;
                }
              })
            );

            return results.some((result) => result === true)
              ? true
              : createError({
                  path,
                  message: results.filter((result) => result !== true),
                });
          });
        }

        default:
          keywordsMissing.object.push(propKey);
          break;
      }

      return yupAcc;
    }
  );
};
