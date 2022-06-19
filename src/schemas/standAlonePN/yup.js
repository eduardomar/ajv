const schemaObj = require('./schema.json');
const value = require('./value.json');
const convertToYup = require('../../utils/convertToYup');
const debug = require('../../utils/debug')('Yup', 'standAlonePN');

module.exports = async () => {
  debug('Init');
  const schema = convertToYup(schemaObj);
  try {
    // debug('%s', JSON.stringify(schema.describe()));
    // debug(
    //   'describe ::> %O',
    //   Object.fromEntries(
    //     Object.entries(schema.describe()).map(([key, value]) => {
    //       if (key === 'fields') return [key, Object.keys(value)];
    //       return [key, value];
    //     })
    //   )
    // );
    // debug(
    //   'describe ::> %s',
    //   JSON.stringify(schema.describe().fields.affirmationOfCompliance)
    // );
    const result = await schema.validate(value, { abortEarly: false });
    debug('Valid!!!');
    // debug('%s', JSON.stringify(result));
  } catch (err) {
    // err.name; // => 'ValidationError'
    // err.errors; // => ['Deve ser maior que 18']
    // debug(JSON.stringify(err));
    debug({ name: err.name, errors: err.errors });
    // debug({
    //   name: err.name,
    //   errors: err.errors.reduce(
    //     (acc, error) => {
    //       if (error?.length && typeof error === 'string') {
    //         let matches = [
    //           ...(error.match(
    //             /^([^\s]+) must be a `([^`]+)` type, but the final value was: `null`.+/i
    //           ) ?? []),
    //         ];

    //         if (matches.length === 3) {
    //           acc[matches[2]] = acc[matches[2]] ?? [];
    //           acc[matches[2]].push(matches[1]);
    //           return acc;
    //         } else {
    //           let matches = [
    //             ...(error.match(
    //               /^([^\s]+) must be exactly (\d)+ characters.*/i
    //             ) ?? []),
    //           ];

    //           if (matches.length === 3) {
    //             acc.characters[matches[2]] = acc.characters[matches[2]] ?? '';
    //             acc.characters[matches[2]] = `${acc.characters[matches[2]]}|${
    //               matches[1]
    //             }`;
    //           } else {
    //             let matches = [
    //               ...(error.match(
    //                 /^([^\s]+) must be one of the following values:((\s[A-Z0-9]+(,|$))+)/i
    //               ) ?? []),
    //             ];

    //             if (matches.length === 5) {
    //               acc.enum[matches[1]] = matches[2].trim().split(/\s*,\s*/i)[0];
    //             }
    //           }
    //         }
    //       }

    //       acc.other.push(error);
    //       return acc;
    //     },
    //     { other: [], characters: {}, enum: {} }
    //   ),
    // });
  }
};
