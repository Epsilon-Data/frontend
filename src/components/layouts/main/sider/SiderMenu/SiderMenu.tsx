import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import { SidebarNavigationItem, returnCurrentNav } from '../sidebarNavigation';

interface SiderContentProps {
  selectedNav: string;
}

const SiderMenu: React.FC<SiderContentProps> = ({ selectedNav }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  const currentNav = returnCurrentNav(selectedNav);

  const sidebarNavFlat = currentNav.reduce(
    (result: SidebarNavigationItem[], current) =>
      result.concat(current.children && current.children.length > 0 ? current.children : current),
    [],
  );

  const currentMenuItem = sidebarNavFlat.find(({ url }) => url === location.pathname);
  const defaultSelectedKeys = currentMenuItem ? [currentMenuItem.key] : [];

  const openedSubmenu = currentNav.find(({ children }) => children?.some(({ url }) => url === location.pathname));
  const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

  useEffect(() => {
    if (location) {
      if (current !== location.pathname) {
        setCurrent(location.pathname);
      }
    }
  }, [location, current]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleClick(e: any) {
    setCurrent(e.key);
  }

  return (
    <S.Menu
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      selectedKeys={defaultSelectedKeys}
      onClick={handleClick}
      disabledOverflow={true}
      items={currentNav.map((nav) => {
        const isSubMenu = nav.children?.length;

        return {
          key: nav.key,
          title: t(nav.title),
          label: isSubMenu ? t(nav.title) : <Link to={nav.url || ''}>{t(nav.title)}</Link>,
          icon: nav.icon,
          children:
            isSubMenu &&
            nav.children &&
            nav.children.map((childNav) => ({
              key: childNav.key,
              label: <Link to={childNav.url || ''}>{t(childNav.title)}</Link>,
              title: t(childNav.title),
            })),
        };
      })}
    />
  );
};

export default SiderMenu;
