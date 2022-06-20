const keywordsMissing = {
  types: [],
  object: [],
  string: [],
  number: [],
  array: [],
  mixed: [],
  ignored: [],
};

const clear = () => {
  Object.keys(keywordsMissing).forEach((key) => {
    keywordsMissing[key] = [];
  });
};

const get = () =>
  Object.fromEntries(
    Object.entries(keywordsMissing).map(([key, arr]) => [
      key,
      [...new Set(arr)],
    ])
  );

module.exports = { keywordsMissing, clear, get };
