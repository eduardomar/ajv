/* eslint-disable import/no-cycle */
import * as Yup from 'yup';

import getDebug from './debug';
import { keywordsMissing } from './keywordsMissing';
import reduceProps from './reduceProps';
import convert from './convert';
import fixJsonSchemaProps from './fixJsonSchemaProps';

const { log, error } = getDebug('convertArray');

export default (jsonSchema, yupSchema) => {
  // log('Init');
  return reduceProps(
    jsonSchema,
    Yup.isSchema(yupSchema) ? yupSchema : Yup.array(),
    (yupAcc, propKey, propValue) => {
      // log('%s %s', propKey, yupAcc.type);
      switch (propKey) {
        case 'items': {
          if (propValue) {
            if (!Array.isArray(propValue)) {
              // log({ propValue });
              const schema = fixJsonSchemaProps(propValue);
              if (schema) return yupAcc.of(convert(schema));
            }

            const yupSchemasItems = propValue.map((item) => {
              const schema = fixJsonSchemaProps(item);
              return convert(schema);
            });

            return yupAcc.test(
              'items-order',
              async function testItemOrder(arr) {
                const { path, createError } = this;

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
                  await Yup.object(obj)
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
              }
            );
          }
          break;
        }

        case 'oneOf': {
          // log('oneOf', yupAcc.type);
          const oneOf = Array.isArray(propValue) ? propValue : [propValue];
          const yupSchemasOneOf = oneOf.map((jsonSchemaOneOf) => {
            return convert({
              type: yupAcc.type ?? jsonSchemaOneOf.type,
              ...jsonSchemaOneOf,
            });
          });

          return yupAcc.test('one-of', async function testOneOf(arr) {
            const { path, createError } = this;
            // debug({ arr, path });
            const results = await Promise.all(
              yupSchemasOneOf.map(async (yupSchemaOneOf) => {
                try {
                  await Yup.object({ [path]: yupSchemaOneOf.clone() }).validate(
                    { [path]: arr },
                    { abortEarly: false }
                  );
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
