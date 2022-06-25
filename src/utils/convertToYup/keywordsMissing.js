export const keywordsMissing = {
  types: [],
  object: [],
  string: [],
  number: [],
  array: [],
  mixed: [],
  ignored: [],
};

export const clear = () => {
  Object.keys(keywordsMissing).forEach((key) => {
    keywordsMissing[key] = [];
  });
};

export const get = () =>
  Object.fromEntries(
    Object.entries(keywordsMissing).map(([key, arr]) => [
      key,
      [...new Set(arr)],
    ])
  );
