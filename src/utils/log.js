const showErrors = Boolean(process.env.SHOW_ERRORS === 'true');

const valuesToStr = (values, maxLengthValue) =>
  values
    .sort((a, b) => a - b)
    .map((value) => {
      // console.log({ value, type: typeof value });
      return `${value}`.padStart(maxLengthValue, ' ');
    })
    .join(', ');

module.exports = (debug, values, data) => {
  // debug('Init');
  const maxLengthValue = Math.max(...values.map((value) => `${value}`.length));
  data.forEach(() => {});

  // debug('%o', { maxLengthValue });
  let maxLengthLine = 0;
  data
    .map(({ _id, valid, invalid, errors }) => {
      const valids = valid.length
        ? ` ${valuesToStr(valid, maxLengthValue)} `
        : '';
      const invalids = invalid.length
        ? ` ${valuesToStr(invalid, maxLengthValue)} `
        : '';
      const max = Math.max(valids.length, invalids.length);
      const lines = [
        _id,
        `    :: > Valid:   [${`${valids}`.padEnd(max, ' ')}]`,
        `    :: > Invalid: [${`${invalids}`.padEnd(max, ' ')}]`,
      ];
      maxLengthLine = Math.max(
        maxLengthLine,
        ...lines.map((line) => line.length + 4)
      );

      return lines;
    })
    .forEach((lines) => {
      const separator = new Array(maxLengthLine).fill('-').join('');

      debug('%s', separator);
      lines
        .filter((line) => line?.length)
        .forEach((line) =>
          debug('| %s |', line.padEnd(maxLengthLine - 4, ' '))
        );
      debug('%s', separator);
      debug(''.padStart(maxLengthLine, ' '));
    });
};
