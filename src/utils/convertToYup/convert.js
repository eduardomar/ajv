/* eslint-disable import/no-cycle */
import * as Yup from 'yup';

import getDebug from './debug';
import { keywordsMissing } from './keywordsMissing';
import convertObject from './convertObject';
import convertString from './convertString';
import convertArray from './convertArray';
import convertNumber from './convertNumber';
import convertMixed from './convertMixed';

const { log, error } = getDebug('convert');

const getTypes = (schema) => {
  const normType = schema?.type ?? [];
  const types = Array.isArray(normType) ? normType : [schema?.type];
  const enumAllowed = Array.isArray(schema?.enum) ? schema.enum : [];

  return {
    isNullable: types.includes('null') || enumAllowed.includes(null),
    types: types
      .filter((type) => type?.length && type !== 'null')
      .map((type) => type.toLocaleLowerCase()),
  };
};

const fixSchema = (schema) => {
  const jsonSchema = JSON.parse(JSON.stringify(schema ?? {}));
  if (jsonSchema.minlength) {
    jsonSchema.minLength = jsonSchema.minlength;
    delete jsonSchema.minlength;
  }

  if (
    jsonSchema.minLength === jsonSchema.maxLength &&
    Number.isInteger(parseInt(jsonSchema.minLength, 10))
  ) {
    jsonSchema.length = jsonSchema.minLength;
    delete jsonSchema.minLength;
    delete jsonSchema.maxLength;
  }

  if (jsonSchema.additionalItems === false) {
    delete jsonSchema.additionalItems;
    const values = [jsonSchema.minItems ?? 0, jsonSchema.maxItems ?? 0];
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min > 0) {
      jsonSchema.minItems = min;
    }
    if (max > 0) {
      jsonSchema.maxItems = max;
    }
  } else if (jsonSchema.additionalItems === true) {
    delete jsonSchema.additionalItems;
    delete jsonSchema.maxItems;
  }

  return jsonSchema;
};

export default (schema, yupSchema, extraValidations = {}) => {
  const jsonSchema = fixSchema(schema);
  const { isNullable, types } = getTypes(jsonSchema);
  if (!types?.length) {
    types.push('mixed');
  }
  let retSchema;
  const type = types?.length === 1 ? types[0] : 'mixed';

  // log('Init :: %s', type);
  switch (type) {
    case 'object':
      retSchema = convertObject(jsonSchema, yupSchema);
      break;

    case 'string':
      retSchema = convertString(jsonSchema, yupSchema);
      break;

    case 'array':
      retSchema = convertArray(jsonSchema, yupSchema);
      break;

    case 'number':
    case 'integer':
      retSchema = convertNumber(jsonSchema, yupSchema);
      if (type === 'integer') {
        retSchema.integer();
      }
      break;

    case 'mixed':
      retSchema = convertMixed(jsonSchema, yupSchema);
      break;

    default:
      retSchema = Yup.mixed();
      keywordsMissing.types.push(type);
      break;
  }

  if (Yup.isSchema(retSchema)) {
    retSchema = Object.entries(extraValidations ?? {})
      .concat([['nullable', [isNullable]]])
      .reduce((yupAcc, [func, extra]) => {
        if (typeof (yupAcc?.[func] ?? '') === 'function') {
          // console.log(schema.title, { func, extra: extra ?? [] });
          const extraData = Array.isArray(extra) ? extra : [];
          // if (type === 'array') log('%o', { func, extra, extraData });
          return yupAcc[func](...extraData);
        }

        return yupAcc;
      }, retSchema);
  }

  return retSchema.clone();
};
