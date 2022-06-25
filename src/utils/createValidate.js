import Ajv from 'ajv';
import draft6MetaSchema from 'ajv/lib/refs/json-schema-draft-06.json';

import getDebug from './debug';

const debug = getDebug('createValidate');
const base = `"\\$ref":"[^"]+"`;
const regexes = [
  [new RegExp(`,${base},`, 'ig'), ','],
  [new RegExp(`(,${base})|(${base},)`, 'ig'), ''],
];

export default (...schemas) => {
  if (!schemas?.length) return undefined;

  const [schema, ...rest] = JSON.parse(
    regexes.reduce(
      (acc, [regex, value]) => acc.replace(regex, value),
      JSON.stringify(schemas)
    )
  );
  // debug({ schema: !!schema, rest: rest.length });
  const ajv = new Ajv({ allErrors: true });
  ajv.addMetaSchema(draft6MetaSchema);

  rest.forEach((defsSchema) => {
    ajv.addSchema(defsSchema);
  });

  const validate = ajv.compile(schema);
  return validate;
};
