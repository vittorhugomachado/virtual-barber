export const stripNonDigits = (value: string): string => {
  return value.replace(/\D/g, '');
};