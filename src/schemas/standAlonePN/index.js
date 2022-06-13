const schema = require('./schema.json');
const value = require('./value.json');
const createValidate = require('../../utils/createValidate');
const debug = require('../../utils/debug')('standAlonePN');

module.exports = () => {
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
        Object.entries(error).map(([key, value]) => {
          if (typeof value === 'string') return [key, value];

          return [key, JSON.stringify(value)];
        })
      );
    });
    debug('%O %d', { errors }, errors.length);
  }
};
