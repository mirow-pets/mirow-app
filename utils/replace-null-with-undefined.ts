type NullToUndefined<T> = T extends null
  ? undefined
  : T extends (infer U)[] // Handle arrays
  ? NullToUndefined<U>[]
  : T extends object // Handle objects (non-array)
  ? { [K in keyof T]: NullToUndefined<T[K]> }
  : T; // Handle primitives (including undefined, numbers, strings, etc.)

export const replaceNullWithUndefined = <T>(data: T): T => {
  // Handle the base case: If the data is strictly 'null', return 'undefined'.
  if (data === null) {
    // We cast to `any` here because TypeScript cannot perfectly infer the deep
    // structural transformation from the runtime check 'data === null'.
    return undefined as any;
  } else if (data instanceof Date) {
    return data as T;
  }

  // If the data is not an object or is already 'undefined', return it as is.
  if (typeof data !== "object" || data === undefined) {
    return data as T;
  }

  // --- Handle Arrays ---
  if (Array.isArray(data)) {
    // Map over the array, recursively calling the function on each element.
    // The map function naturally returns a new array.
    return data.map(replaceNullWithUndefined) as T;
  }

  // --- Handle Objects (non-array) ---
  // We use a type assertion to tell TypeScript that `newObject` will have the correct output shape.
  const newObject = {} as NullToUndefined<T>;
  for (const key in data) {
    // Ensure we only process own properties
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Recursively process the value and assign it to the new object.
      const value = data[key];
      // We use `key as keyof NullToUndefined<T>` to allow property assignment.
      (newObject as any)[key] = replaceNullWithUndefined(value);
    }
  }

  return newObject as T;
};
