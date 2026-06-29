/**
 * Map a Firebase collection snapshot (a record of `id -> raw entry`) into
 * validated domain objects, skipping and logging any record that fails its
 * Zod schema instead of throwing.
 *
 * The `firebaseTo*()` converters call `Schema.parse()` and throw on malformed
 * data. That strictness is correct for a single record, but a collection read
 * should not let one corrupt entry crash the whole list — so we catch per
 * entry, log the offending key, and drop it from the result.
 */
export function parseCollection<T>(
  data: Record<string, unknown>,
  convert: (id: string, entry: unknown) => T,
): T[] {
  const result: T[] = [];
  for (const [id, entry] of Object.entries(data)) {
    try {
      result.push(convert(id, entry));
    } catch (error) {
      console.warn(
        `Skipping malformed Firebase record "${id}": ${String(error)}`,
      );
    }
  }
  return result;
}
