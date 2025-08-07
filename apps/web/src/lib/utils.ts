import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
}

/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified delay has elapsed since the last time the debounced function was invoked.
 * 
 * @template T - The type of the function to debounce
 * @param fn - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @returns A debounced version of the function
 * 
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Extracts only the dirty (changed) fields from React Hook Form based on dirtyFields.
 * This is more efficient than deep comparison as it uses RHF's built-in change tracking.
 * 
 * @template T - The type of form values
 * @param dirtyFields - The dirtyFields object from React Hook Form formState
 * @param formValues - Current form values from getValues()
 * @returns An object containing only the dirty fields with their current values
 * 
 * @example
 * const { formState: { dirtyFields }, getValues } = useForm();
 * const changedData = getDirtyFields(dirtyFields, getValues());
 * // Returns only fields that have been modified by user
 */
export function getDirtyFields<T extends Record<string, any>>(
  dirtyFields: Record<string, any>,
  formValues: T
): Partial<T> {
  const dirtyData: Partial<T> = {};
  
  function extractDirtyFields(
    dirty: Record<string, any>,
    values: Record<string, any>,
    result: Record<string, any>
  ): void {
    for (const key in dirty) {
      if (Object.hasOwn(dirty, key)) {
        const isDirty = dirty[key];
        const value = values[key];
        
        if (isDirty === true) {
          // Field is dirty, include its value
          result[key] = value;
        } else if (typeof isDirty === 'object' && isDirty !== null && typeof value === 'object' && value !== null) {
          // Nested object, recursively check dirty fields
          result[key] = {};
          extractDirtyFields(isDirty, value, result[key]);
          
          // Remove empty nested objects
          if (Object.keys(result[key]).length === 0) {
            delete result[key];
          }
        }
      }
    }
  }
  
  extractDirtyFields(dirtyFields, formValues, dirtyData);
  return dirtyData;
}

/**
 * Compares two objects and returns only the changed fields from the new object.
 * Performs deep comparison for nested objects.
 * 
 * @template T - The type of objects to compare
 * @param oldData - The original object
 * @param newData - The new object to compare against
 * @returns An object containing only the changed fields
 * 
 * @example
 * const changes = getChangedFields(
 *   { name: 'John', age: 25, address: { city: 'NY' } },
 *   { name: 'John', age: 26, address: { city: 'LA' } }
 * );
 * // Returns: { age: 26, address: { city: 'LA' } }
 */
export function getChangedFields<T extends Record<string, any>>(
  oldData: T | null | undefined,
  newData: T
): Partial<T> {
  if (!oldData) {
    return newData;
  }
  
  const changes: Partial<T> = {};
  
  for (const key in newData) {
    if (Object.hasOwn(newData, key)) {
      const oldValue = oldData[key];
      const newValue = newData[key];
      
      if (isDeepEqual(oldValue, newValue)) {
        continue;
      }
      
      changes[key] = newValue;
    }
  }
  
  return changes;
}

/**
 * Performs deep equality comparison between two values.
 * 
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if values are deeply equal, false otherwise
 */
function isDeepEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }
  
  if (a == null || b == null) {
    return a === b;
  }
  
  if (typeof a !== typeof b) {
    return false;
  }
  
  if (typeof a !== 'object') {
    return false;
  }
  
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) {
    return false;
  }
  
  for (const key of keysA) {
    if (!Object.hasOwn(b, key)) {
      return false;
    }
    
    if (!isDeepEqual(a[key], b[key])) {
      return false;
    }
  }
  
  return true;
}
