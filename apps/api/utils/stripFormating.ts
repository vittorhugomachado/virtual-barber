export const stripNonDigits = (value: string): string => {
  const textNumber = value.replace(/\D/g, '');

  return textNumber; 
};