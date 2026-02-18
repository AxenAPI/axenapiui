export const Capitalize = (input: string) => {
  const s = input.toLowerCase();
  return String(s[0]).toUpperCase() + String(s).slice(1);
};

/**
 * Checks is desktop build mode.
 */
export const checkIsDesktopMode = () => process.env.DESKTOP === 'true';

/**
 * Checks is readOnly build mode.
 */
export const checkIsReadOnlyMode = () => process.env.READ_ONLY === 'true';
