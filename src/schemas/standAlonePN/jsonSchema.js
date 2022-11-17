import schema from './schema.json' assert { type: 'json' };
import createValidate from '../../utils/createValidate';
import getDebug from './debug';

const debug = getDebug('json-schema');

export default (value) => {
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
