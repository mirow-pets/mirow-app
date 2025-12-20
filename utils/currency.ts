/**
 * Converts an amount from a major currency unit to its minor unit (e.g., USD dollars to cents, JPY yen to sen).
 * @param amount Amount in the major currency unit (number or string)
 */
export const toMinorUnit = (amount: number | string): number => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return 0;

  const decimals = 2;
  const multiplier = Math.pow(10, decimals);

  return Math.round(num * multiplier);
};

/**
 * Converts an amount from minor currency units (e.g., cents) to the major unit (e.g., USD dollars).
 * @param amount Amount in the minor currency unit (number or string)
 */
export const toMajorUnit = (amount: number | string): number => {
  const num = typeof amount === "string" ? parseInt(amount, 10) : amount;
  if (isNaN(num)) return 0;

  const decimals = 2;
  const divider = Math.pow(10, decimals);

  // Fix to the correct decimals
  const rounded = Number((num / divider).toFixed(decimals));
  return rounded;
};
