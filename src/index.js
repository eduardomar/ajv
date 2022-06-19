const debug = require('./utils/debug')();
const oneOf = require('./schemas/oneOf');
const anyOf = require('./schemas/anyOf');
const allOf = require('./schemas/allOf');
const standAlonePN = require('./schemas/standAlonePN');

switch (process?.env?.schema ?? '') {
  case 'oneOf':
    oneOf();
    break;
  case 'anyOf':
    anyOf();
    break;
  case 'allOf':
    allOf();
    break;
  case 'standAlonePN':
    standAlonePN();
    break;

  default:
    debug('Values allowed %o', ['oneOf', 'anyOf', 'allOf', 'standAlonePN']);
    break;
}
