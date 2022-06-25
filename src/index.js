import getDebug from './utils/debug';
import oneOf from './schemas/oneOf';
import anyOf from './schemas/anyOf';
import allOf from './schemas/allOf';
import standAlonePN from './schemas/standAlonePN';

const debug = getDebug();

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
