/**
 * Converts an amount from a major currency unit to its minor unit (e.g., USD dollars to cents, JPY yen to sen).
 * @param amount Amount in the major currency unit (number or string)
 */
export const majorToCentUnit = (amount: number | string): number => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return 0;
  return +(Number(amount) * 100).toFixed();
};

/**
 * Converts an amount from minor currency units (e.g., cents) to the major unit (e.g., USD dollars).
 * @param amount Amount in the minor currency unit (number or string)
 */
export const centToMajorUnit = (amount: number | string): number => {
  const num = typeof amount === "string" ? parseInt(amount, 10) : amount;
  if (isNaN(num)) return 0;
  return +(Number(amount) / 100).toFixed(2);
};
