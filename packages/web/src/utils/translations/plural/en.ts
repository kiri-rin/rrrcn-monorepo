export const pluralEn = {
  objects: ["Object", "Objects"],
};
export const getPluralEn = ({
  number,
  key,
}: {
  number: number;
  key: keyof typeof pluralEn;
}) => {
  if (number === 1) {
    return pluralEn[key][0];
  } else {
    return pluralEn[key][1];
  }
};
