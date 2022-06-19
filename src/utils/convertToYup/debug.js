const getDebug = require('../debug');

module.exports = (...args) => getDebug('convertToYup', ...(args || []));
