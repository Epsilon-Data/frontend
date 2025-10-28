export const ARCHETYPE_API_URL = '/hub/archetype';
export const DATE_FORMAT = 'DD/MM/YYYY';

export const STATUS_COLORS: { [key: string]: string } = {
  PUBLISHED: '#1481F1',
  ACTIVE: '#50C878',
  DRAFT: '#AEAEAE',
};

export function toTitleCase(text: string) {
  return text
    .toLowerCase()
    .split(' ')
    .map((word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
