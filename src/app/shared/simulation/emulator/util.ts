

export function AsArray<T>(itemOrArray: T | T[]): T[] {
  return (Array.isArray(itemOrArray) ? itemOrArray : [itemOrArray]) as T[];
}

export function AsSingle<T>(itemOrArray: T | T[]): T {
  if (Array.isArray(itemOrArray)) {
    throw new Error('Attempting to return an array as a single item');
  }
  return itemOrArray as T;
}
