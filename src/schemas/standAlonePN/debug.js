const getDebug = require('../../utils/debug');

module.exports = (...args) => getDebug('standAlonePN', ...(args || []));
