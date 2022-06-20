module.exports = (propValue) => {
  if (propValue.type) return propValue;

  let fixProps = { ...propValue };
  if (fixProps.properties || fixProps.allOf) {
    fixProps.type = 'object';
  } else if (Object.keys(fixProps).length) {
    fixProps = {
      type: 'object',
      properties: fixProps,
    };
  }

  if (fixProps.type.length) return fixProps;

  return null;
};
