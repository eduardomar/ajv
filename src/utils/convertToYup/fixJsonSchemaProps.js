export default (propValue, yupSchema) => {
  if (propValue.type) return propValue;

  let schema = { ...propValue };
  if (schema.properties || schema.allOf) {
    schema.type = 'object';
  } else if (Object.keys(schema).length) {
    schema = {
      type: 'object',
      properties: schema,
    };
  }

  if (schema?.properties) {
    schema.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([key, { type, ...props }]) => [
        key,
        {
          type: yupSchema?.fields?.[key]?.type ?? type,
          ...props,
        },
      ])
    );
  }
  schema.properties = (schema?.required ?? []).reduce((acc, requireField) => {
    if (!acc[requireField]) {
      acc[requireField] = {
        type: yupSchema?.fields?.[requireField ?? '']?.type ?? 'mixed',
      };
    }

    return acc;
  }, schema.properties);

  if (schema.type.length) return schema;

  return null;
};
