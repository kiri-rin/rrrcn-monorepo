export const getIdGetter = (prefix?: string) => {
  let counter = 0;
  return () => {
    const prev = counter++;
    return `${prefix}${prev}`;
  };
};
