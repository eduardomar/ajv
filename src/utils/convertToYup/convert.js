/* eslint-disable global-require */
const yup = require('yup');
const debug = require('./debug')('convert');
const { keywordsMissing } = require('./keywordsMissing');

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
    // debug('%d', 3);
    delete jsonSchema.additionalItems;
    delete jsonSchema.maxItems;
  }

  if (
    jsonSchema.minItems === jsonSchema.maxItems &&
    Number.isInteger(parseInt(jsonSchema.minItems, 10))
  ) {
    // debug('%d', 4);
    jsonSchema.length = jsonSchema.minItems;
    delete jsonSchema.minItems;
    delete jsonSchema.maxItems;
  }

  return jsonSchema;
};

module.exports = (schema, yupSchema, extraValidations = {}) => {
  const jsonSchema = fixSchema(schema);
  const { isNullable, types } = getTypes(jsonSchema);
  if (!types?.length) {
    types.push('mixed');
  }
  let retSchema;
  const type = types?.length === 1 ? types[0] : 'mixed';

  // debug('Init :: %s', type);
  switch (type) {
    case 'object':
      retSchema = require('./convertObject')(jsonSchema, yupSchema);
      break;

    case 'string':
      retSchema = require('./convertString')(jsonSchema, yupSchema);
      break;

    case 'array':
      retSchema = require('./convertArray')(jsonSchema, yupSchema);
      break;

    case 'number':
    case 'integer':
      retSchema = require('./convertNumber')(jsonSchema, yupSchema);
      if (type === 'integer') {
        retSchema.integer();
      }
      break;

    default:
      retSchema = yup.mixed();
      keywordsMissing.types.push(type);
      break;
  }

  if (yup.isSchema(retSchema)) {
    retSchema = Object.entries(extraValidations ?? {})
      .concat([['nullable', [isNullable]]])
      .reduce((yupAcc, [func, extra]) => {
        if (typeof (yupAcc?.[func] ?? '') === 'function') {
          // console.log(schema.title, { func, extra: extra ?? [] });
          const extraData = Array.isArray(extra) ? extra : [];
          // if (type === 'array') debug('%o', { func, extra, extraData });
          return yupAcc[func](...extraData);
        }

        return yupAcc;
      }, retSchema);
  }

  return retSchema;
};
