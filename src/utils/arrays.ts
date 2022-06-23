export const getSortedObjectByProperty = (obj: Record<any, any>, property: string) => {
  return Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => a[property] - b[property]));
};
