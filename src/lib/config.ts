/**
 * Central feature flags.
 *
 * PRE_LAUNCH_MODE — when true, the catalog is browse-only:
 *   - "Add to cart" buttons are replaced with "Notify me when available"
 *   - Cart drawer shows waitlist CTA instead of items
 *   - /checkout redirects to /waitlist
 *   - Order tracking still works for any pre-existing orders
 *
 * Flip to false the day sales open. No code changes required elsewhere.
 */
export const PRE_LAUNCH_MODE = true;
