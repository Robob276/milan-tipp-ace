/**
 * Utilities for handling shared/tied medal positions.
 * 
 * Results can have multiple countries per position, stored as comma-separated strings.
 * E.g. silver = "Österreich (AUT),Schweiz (SUI)" means two silver medals were awarded.
 */

/** Split a potentially comma-separated result value into individual countries */
export const splitMedalValue = (value: string): string[] => {
  if (!value) return [];
  return value.split(',').map(v => v.trim()).filter(Boolean);
};

/** Join multiple countries into a comma-separated result value */
export const joinMedalValues = (values: string[]): string => {
  return values.filter(Boolean).join(',');
};

/** Check if a single prediction matches a (possibly shared) result position */
export const isPredictionMatch = (prediction: string, resultValue: string): boolean => {
  if (!prediction || !resultValue) return false;
  const resultCountries = splitMedalValue(resultValue);
  return resultCountries.includes(prediction);
};

/** Calculate score for a single event considering shared positions */
export const calculateEventScore = (
  prediction: { gold: string; silver: string; bronze: string },
  result: { gold: string; silver: string; bronze: string }
): number => {
  let score = 0;
  if (isPredictionMatch(prediction.gold, result.gold)) score += 3;
  if (isPredictionMatch(prediction.silver, result.silver)) score += 2;
  if (isPredictionMatch(prediction.bronze, result.bronze)) score += 1;
  return score;
};
