import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import { SidebarNavigationItem, returnCurrentNav } from '../sidebarNavigation';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface SiderContentProps {
  selectedNav: string;
}

const SiderMenu: React.FC<SiderContentProps> = ({ selectedNav }) => {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  const { t } = useTranslation();
  const admin = useAppSelector((state) => state.user.user?.roles?.includes('admin') || false);
  const currentNav = returnCurrentNav(selectedNav, admin);

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
          label: isSubMenu ? (
            t(nav.title)
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', position: 'relative', height: '100%' }}>
              <Link to={nav.url || ''} style={{ flex: 1 }}>
                {t(nav.title)}
              </Link>
              {current === nav.url && <div className="menu-indicator" />}
            </span>
          ),
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
