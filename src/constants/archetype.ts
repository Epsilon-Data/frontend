export const ARCHETYPE_API_URL = '/hub/archetype';
export const DATE_FORMAT = 'DD/MM/YYYY';

export function toTitleCase(text: string) {
  return text
    .toLowerCase()
    .split(' ')
    .map((word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
