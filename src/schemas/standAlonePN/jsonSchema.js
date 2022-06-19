const schema = require('./schema.json');
const createValidate = require('../../utils/createValidate');
const debug = require('./debug')('json-schema');

module.exports = (value) => {
  debug('Init');
  // debug(
  //   'keys %o',
  //   JSON.stringify(
  //     Object.fromEntries(
  //       Object.keys(schema.content.properties).map((key) => [key, ''])
  //     )
  //   )
  // );

  const validate = createValidate(schema);
  const isValid = validate(value);
  debug('%o', { isValid });
  if (!isValid) {
    const errors = (validate?.errors ?? []).map((error) => {
      return Object.fromEntries(
        Object.entries(error).map(([key, errorValue]) => {
          if (typeof errorValue === 'string') return [key, errorValue];

          return [key, JSON.stringify(errorValue)];
        })
      );
    });
    debug('%O %d', { errors }, errors.length);
  }
};