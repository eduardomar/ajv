const value = require('./value.json');
const debug = require('./debug')();
const yup = require('./yup');
const jsonSchema = require('./jsonSchema');

module.exports = async () => {
  debug('init');

  const result = await yup(value);
  if (result) {
    // debug({ packaging: result.packaging });
    jsonSchema(value);
  }
};
