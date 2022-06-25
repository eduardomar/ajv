/* eslint-disable import/no-cycle */
import * as Yup from 'yup';

import getDebug from './debug';
import { keywordsMissing } from './keywordsMissing';
import reduceProps from './reduceProps';
import convert from './convert';
import fixJsonSchemaProps from './fixJsonSchemaProps';

const { log, error } = getDebug('convertObject');

export default ({ required, ...jsonSchema }, yupSchema) => {
  // log('Init');
  return reduceProps(
    jsonSchema,
    Yup.isSchema(yupSchema)
      ? yupSchema
      : Yup.object({}).strict().noUnknown(true),
    (yupAcc, propKey, propValue) => {
      // log({ propKey, propValue: !!propValue });
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
              // log({ key, value, fields: Object.keys(yupAcc?.fields) });
              return [
                key,
                convert(
                  { type: oldSchema?.type ?? value.type, ...value },
                  oldSchema,
                  required?.includes?.(key) ? { required: null } : {}
                ),
              ];
            })
            .filter(([, value]) => Yup.isSchema(value));

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
                      return [key, Yup?.[schemaField.type]?.()];
                    }
                  )
                )
              )
              .test(`all-of-${index}`, async function testAllOf(value) {
                const { path } = this;
                return Yup.object({ [path]: yupSchemaAllOf.clone() }).validate(
                  { [path]: value },
                  { abortEarly: false }
                );
              });
          }, yupAcc);
        }

        default:
          keywordsMissing.object.push(propKey);
          break;
      }

      return yupAcc;
    }
  );
};
