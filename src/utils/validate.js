const createValidate = require('./createValidate');

module.exports = (schema, values) => {
  const { _id, ...rest } = schema;
  const validate = createValidate(rest);

  const { valid, invalid } = values.reduce(
    (acc, value) => {
      const isValid = validate(value);
      if (isValid) {
        acc.valid.push(value);
      } else {
        acc.invalid.push(value);
      }

      return acc;
    },
    { valid: [], invalid: [] }
  );

  return {
    _id,
    valid,
    invalid,
    errors: validate?.errors ?? [],
  };
};
