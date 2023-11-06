export const pluralRu = {
  objects: ["Объект", "Объекта", "Объектов"],
};
export const getPluralRu = ({
  number = 0,
  key = "objects",
}: {
  number: number;
  key: keyof typeof pluralRu;
}) => {
  if (
    number.toString().endsWith("0") ||
    number.toString().charAt(number.toString().length - 2) === "1" ||
    Number(number.toString().charAt(number.toString().length - 1)) >= 5
  ) {
    return pluralRu[key]?.[2];
  }
  if (number.toString().endsWith("1")) {
    return pluralRu[key]?.[0];
  }
  return pluralRu[key]?.[1];
};
