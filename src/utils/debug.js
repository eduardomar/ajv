import debug from 'debug';

const tag = 'playground-ajv';

if (
  process.env.NODE_ENV !== 'staging' &&
  process.env.NODE_ENV !== 'production'
) {
  debug.enable(`${tag},${tag}:*`);
}

export default (...args) => {
  const namespaces = [tag];
  if (args && args.length) {
    namespaces.push(...args.filter((str) => typeof str === 'string'));
  }

  return debug(namespaces.join(':'));
};
