export const getSortedObjectByValues = (obj: Record<any, any>) => {
  return Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => a - b));
};
