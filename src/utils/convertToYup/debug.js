import getDebug from '../debug';

export default (...args) => {
  const debug = getDebug('convertToYup', ...(args || []));
  return {
    log: debug,
    error: debug.extend('error'),
  };
};
