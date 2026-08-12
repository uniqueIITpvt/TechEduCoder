export const entitlementId = (item: any): string => {
  const value = item?.courseId ?? item?.bookId ?? item?._id ?? item;
  return value == null ? "" : String(value);
};

export const hasEntitlement = (items: any, itemId: unknown): boolean =>
  Array.isArray(items) &&
  items.some((item) => entitlementId(item) === String(itemId));
