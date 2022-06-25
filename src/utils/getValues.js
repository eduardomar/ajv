export default () =>
  new Array(24)
    .fill(0.5)
    .reduce(
      (acc, item) => {
        acc.push(acc[acc.length - 1] + item);

        return acc;
      },
      [0]
    )
    .sort();
