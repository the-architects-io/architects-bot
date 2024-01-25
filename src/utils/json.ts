export const convertNumbersToStrings = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "number") {
    return obj.toString();
  }

  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertNumbersToStrings);
  }

  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[key] = convertNumbersToStrings(obj[key]);
      return acc;
    },
    {} as Record<string, any>,
  );
};
