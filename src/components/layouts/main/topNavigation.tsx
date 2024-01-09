export interface TopNavigationItem {
  key: string;
  label: string;
  url?: string;
}

export const topNavigation: TopNavigationItem[] = [
  { key: 'home', label: 'topNavigation.home', url: '/' },
  { key: 'connect', label: 'topNavigation.connect', url: '/r-connection-requests' },
  { key: 'database', label: 'topNavigation.database', url: '/database-sources' },
  { key: 'browse', label: 'topNavigation.browse' },
];

export function findUrlByKey(key: string): string {
  const item = topNavigation.find((navItem) => navItem.key === key);
  return item && item.url ? item.url : '';
}

export function findKeyByUrl(url: string): string {
  const selectedUrl = getSelectedUrl(url);
  const item = topNavigation.find((navItem) => navItem.url === selectedUrl);
  return item && item.key ? item.key : '';
}

const getSelectedUrl = (pathname: string) => {
  const slashIndex = pathname.indexOf('/', pathname.indexOf('/') + 1);
  if (slashIndex !== -1) {
    return pathname.substring(0, slashIndex);
  }
  return pathname;
};
