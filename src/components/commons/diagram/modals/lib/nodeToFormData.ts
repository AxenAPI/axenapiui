import { NodeDTO } from '@shared/openapi';

// A more specific type for the form data could be defined here
// For now, we'll use a generic one to solve the immediate problem.
// A more specific type for the form data could be defined here
// For now, we'll use a generic one to solve the immediate problem.
export type NodeFormData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in keyof NodeDTO]: any;
};

/**
 * Recursively converts `null` values in an object to `undefined`.
 * This is useful for react-hook-form, which works better with `undefined` for empty/optional fields.
 * @param obj The object to process.
 */
function nullsToUndefined(obj: unknown): unknown {
  if (obj === null) {
    return undefined;
  }
  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(v => nullsToUndefined(v));
  }

  const newObj: { [key: string]: unknown } = {};

  for (const key in obj as object) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = nullsToUndefined((obj as Record<string, unknown>)[key]);
    }
  }

  return newObj;
}

/**
 * Takes a strict NodeDTO and converts it into a data structure
 * that is more suitable for use with react-hook-form.
 * Specifically, it converts all `null` values to `undefined`.
 * @param node The strict NodeDTO from the application state.
 */
export const nodeToFormData = (node: NodeDTO): NodeFormData => nullsToUndefined(node) as NodeFormData;
