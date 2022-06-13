const Ajv = require('ajv');
const draft6MetaSchema = require('ajv/lib/refs/json-schema-draft-06.json');

const debug = require('./debug')('createValidate');

module.exports = (...schemas) => {
  if (!schemas?.length) return;

  const [schema, ...rest] = schemas;
  // debug({ schema: !!schema, rest: rest.length });
  const ajv = new Ajv({ allErrors: true });
  ajv.addMetaSchema(draft6MetaSchema);

  rest.forEach((defsSchema) => {
    ajv.addSchema(defsSchema);
  });

  const validate = ajv.compile(schema);
  return validate;
};
