export const entitlementMatches = (item: any, itemId: unknown): boolean =>
  [item?.courseId, item?.bookId, item?._id, item]
    .filter((candidate) => candidate != null)
    .some((candidate) => String(candidate) === String(itemId));

export const hasEntitlement = (items: unknown, itemId: unknown): boolean =>
  Array.isArray(items) && items.some((item) => entitlementMatches(item, itemId));
