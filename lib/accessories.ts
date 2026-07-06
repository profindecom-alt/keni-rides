/* ============================================================
   KENI RIDES — Rental accessories / add-ons
   A flat set of optional extras a rider can add to any booking.
   Each accessory is €15/day. The translatable label lives in
   messages/<locale>.json under "accessories.items.<slug>".
   ============================================================ */

/** Flat daily price (EUR) charged per selected accessory. */
export const ACCESSORY_PRICE_PER_DAY = 15;

/** Available add-ons. Labels are translated via "accessories.items.<slug>". */
export const ACCESSORY_SLUGS = [
  'helmet',
  'gloves',
  'jacket',
  'pants',
  'boots',
  'gopro',
  'insta360',
] as const;

export type AccessorySlug = (typeof ACCESSORY_SLUGS)[number];

/** Cost of the chosen accessories for a whole rental: count × €15 × days. */
export function accessoriesTotal(count: number, days: number): number {
  return count * ACCESSORY_PRICE_PER_DAY * days;
}
