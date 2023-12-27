export interface TopNavigationItem {
  key: string;
  label: string;
  url?: string;
}

export const topNavigation: TopNavigationItem[] = [
  { key: 'home', label: 'topNavigation.home', url: '/' },
  { key: 'connect', label: 'topNavigation.connect', url: 'r-connection-requests' },
  { key: 'manage', label: 'topNavigation.manage', url: 'database-sources' },
  { key: 'browse', label: 'topNavigation.browse' },
];

export function findUrlByKey(key: string): string {
  const item = topNavigation.find((navItem) => navItem.key === key);
  return item && item.url ? item.url : '';
}
