/* eslint-disable import/no-cycle */
import yup from 'yup';

import getDebug from './debug';
import keywordsMissing from './keywordsMissing';
import reduceProps from './reduceProps';
import convert from './convert';
import fixJsonSchemaProps from './fixJsonSchemaProps';

const debug = getDebug('convertArray');

export default (jsonSchema, yupSchema) => {
  // debug('Init');
  return reduceProps(
    jsonSchema,
    yup.isSchema(yupSchema) ? yupSchema : yup.array(),
    (yupAcc, propKey, propValue) => {
      // debug('%s %s', propKey, yupAcc.type);
      switch (propKey) {
        case 'items': {
          if (propValue) {
            if (!Array.isArray(propValue)) {
              // debug({ propValue });
              const schema = fixJsonSchemaProps(propValue);
              if (schema) return yupAcc.of(convert(schema));
            }

            const yupSchemasItems = propValue.map((item) => {
              const schema = fixJsonSchemaProps(item);
              return convert(schema);
            });

            return yupAcc.test('items-order', async (arr, context) => {
              const { path, createError } = context;
              // if (yupSchemasItems.length !== (arr ?? []).length) return true;
              // debug(yupSchemasItems.length, { arr, path });

              const obj = Object.fromEntries(
                yupSchemasItems.map((yupSchemaItem, index) => {
                  return [`${path}[${index}]`, yupSchemaItem];
                })
              );
              const values = Object.fromEntries(
                (arr ?? []).map((value, index) => {
                  return [`${path}[${index}]`, value];
                })
              );
              try {
                await yup
                  .object(obj)
                  .required()
                  .validate(values, { abortEarly: false });
                // debug({ test });
                return true;
              } catch (err) {
                // debug({ name: err.name, errors: err.errors });
                return createError({
                  path,
                  message: err.errors,
                });
              }
            });
          }
          break;
        }

        case 'oneOf': {
          // debug('oneOf', yupAcc.type);
          const oneOf = Array.isArray(propValue) ? propValue : [propValue];
          const yupSchemasOneOf = oneOf.map((jsonSchemaOneOf) => {
            return convert({
              type: yupAcc.type ?? jsonSchemaOneOf.type,
              ...jsonSchemaOneOf,
            });
          });

          return yupAcc.test('one-of', async (arr, context) => {
            const { path, createError } = context;
            // debug({ arr, path });
            const results = await Promise.all(
              yupSchemasOneOf.map(async (yupSchemaOneOf) => {
                try {
                  await yup
                    .object({ [path]: yupSchemaOneOf.clone() })
                    .validate({ [path]: arr }, { abortEarly: false });
                  return true;
                } catch (err) {
                  // debug({ name: err.name, errors: err.errors });
                  return err;
                }
              })
            );

            return results.filter((result) => result === true).length === 1
              ? true
              : createError({
                  path,
                  message: results.filter((result) => result !== true),
                });
          });
        }

        default:
          keywordsMissing.array.push(propKey);
          break;
      }

      return yupAcc;
    }
  );
};
