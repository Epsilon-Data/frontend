import React, { useEffect, useRef, useState } from 'react';
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

  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const indicatorRef = useRef<HTMLDivElement | null>(null);

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
    if (location.pathname !== current) {
      setCurrent(location.pathname);
    }

    const activeRef = Object.values(itemRefs.current).find((ref) => ref?.dataset.key === current);

    if (indicatorRef.current && activeRef) {
      const menuWrapper = indicatorRef.current.parentElement!;
      const top = activeRef.getBoundingClientRect().top - menuWrapper.getBoundingClientRect().top - 32;
      indicatorRef.current.style.transform = `translateY(${top}px)`;
    }
  }, [location, current]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleClick(e: any) {
    setCurrent(e.key);
  }

  return (
    <S.MenuWrapper>
      <div className="menu-indicator" ref={indicatorRef} />
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
              <div ref={(el) => (itemRefs.current[nav.key] = el)} data-key={nav.url || ''} style={{ flex: 1 }}>
                <Link to={nav.url || ''}>{t(nav.title)}</Link>
              </div>
            ),
            icon: nav.icon,
            children:
              isSubMenu &&
              nav.children &&
              nav.children.map((childNav) => ({
                key: childNav.key,
                label: (
                  <div ref={(el) => (itemRefs.current[childNav.key] = el)} data-key={childNav.url || ''}>
                    <Link to={childNav.url || ''}>{t(childNav.title)}</Link>
                  </div>
                ),
                title: t(childNav.title),
              })),
          };
        })}
      />
    </S.MenuWrapper>
  );
};

export default SiderMenu;
