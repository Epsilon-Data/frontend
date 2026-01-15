import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { returnCurrentNav, SidebarNavigationItem } from '../sidebarNavigation';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { Menu, Tooltip } from 'antd';
import { ProjectStatus } from '@app/api/projects.api';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface SiderContentProps {
  selectedNav: string;
  projectDetails?: { status?: ProjectStatus; orgAdminEmail?: string };
}

const SiderMenu: React.FC<SiderContentProps> = ({ selectedNav, projectDetails }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const currentNav = returnCurrentNav(selectedNav);
  const isMounted = useMounted();
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const canUseDb = ['READY', 'MAPPED'].includes(projectDetails?.status ?? '');
  const user = useAppSelector((state) => state.user.user);
  const isOrgAdmin =
    !!user?.email &&
    !!projectDetails?.orgAdminEmail &&
    user.email.toLowerCase() === projectDetails.orgAdminEmail.toLowerCase();

  const sidebarNavFlat = currentNav.reduce(
    (result: SidebarNavigationItem[], item) => result.concat(item.children?.length ? item.children : item),
    [],
  );

  const currentMenuItem = sidebarNavFlat.find(({ url }) => url === location.pathname);
  const selectedKeys = currentMenuItem ? [currentMenuItem.key] : [];

  const parent = currentNav.find((nav) => nav.children?.some((child) => child.url === location.pathname));
  const defaultOpenKeys = parent ? [parent.key] : [];

  useEffect(() => {
    if (!isMounted) return;

    requestAnimationFrame(() => {
      let activeRef = Object.values(itemRefs.current).find((ref) => ref?.dataset.key === location.pathname);

      if (!activeRef) {
        let matchedChild: SidebarNavigationItem | undefined;
        for (const nav of currentNav) {
          const child = nav.children?.find((child) => child.url === location.pathname);
          if (child) {
            matchedChild = child;
            break;
          }
        }
        if (matchedChild) {
          activeRef = itemRefs.current[matchedChild.key] || null;
        }
      }

      if (indicatorRef.current && activeRef) {
        const menuWrapper = indicatorRef.current.parentElement!;
        const top = activeRef.getBoundingClientRect().top - menuWrapper.getBoundingClientRect().top - 32;
        indicatorRef.current.style.transform = `translateY(${top}px)`;
      }
    });
  }, [location, currentNav, isMounted]);

  function handleOpenChange(e: string[]) {
    requestAnimationFrame(() => {
      let activeRef: HTMLDivElement | null = null;

      if (e.length === 0) {
        const parentNav = currentNav.find((nav) => nav.children?.some((child) => child.url === location.pathname));
        if (parentNav) {
          activeRef = itemRefs.current[parentNav.key] || null;
        }
      } else {
        activeRef = Object.values(itemRefs.current).find((ref) => ref?.dataset.key === location.pathname) || null;
      }

      const menuWrapper = indicatorRef.current?.parentElement;
      if (indicatorRef.current && activeRef && menuWrapper) {
        const top = activeRef.getBoundingClientRect().top - menuWrapper.getBoundingClientRect().top - 32;
        indicatorRef.current.style.transform = `translateY(${top}px)`;
      }
    });
  }

  return (
    <div className="relative pt-8">
      <div className="menu-indicator" ref={indicatorRef} />
      <Menu
        className="bg-transparent border-r-0"
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        onOpenChange={handleOpenChange}
        disabledOverflow={true}
        items={currentNav.map((nav) => {
          const isSubMenu = nav.children?.length;
          const isProjectAccess = nav.key === 'project-access';
          const isDisabled = !canUseDb && nav.dbReadyRequired && !(isProjectAccess && isOrgAdmin);
          const navUrl = nav.url || '';
          return {
            key: nav.key,
            title: t(nav.title),
            label: isSubMenu ? (
              <div
                ref={(el: HTMLDivElement | null) => {
                  itemRefs.current[nav.key] = el;
                }}
              >
                {t(nav.title)}
              </div>
            ) : (
              <Tooltip
                title={isDisabled ? t('project.main.dbMapping.fallback.sidebarTooltip') : ''}
                placement="right"
                color={'#AEAEAE'}
              >
                <div
                  ref={(el: HTMLDivElement | null) => {
                    itemRefs.current[nav.key] = el;
                  }}
                  data-key={searchParams.size !== 0 ? `${navUrl}?${searchParams.toString()}` : navUrl}
                  style={{ flex: 1 }}
                >
                  {isDisabled ? (
                    <span className="cursor-not-allowed opacity-60">{t(nav.title)}</span>
                  ) : (
                    <Link to={searchParams.size !== 0 ? `${navUrl}?${searchParams.toString()}` : navUrl}>
                      {t(nav.title)}
                    </Link>
                  )}
                </div>
              </Tooltip>
            ),

            icon: nav.icon,
            children:
              isSubMenu &&
              nav.children &&
              nav.children.map((childNav) => {
                const childUrl = childNav.url || '';
                const childDisabled = !canUseDb && childNav.dbReadyRequired;
                return {
                  key: childNav.key,
                  label: (
                    <Tooltip
                      title={childDisabled ? t('project.main.dbMapping.fallback.sidebarTooltip') : ''}
                      placement="right"
                      color={'#AEAEAE'}
                    >
                      <div
                        ref={(el: HTMLDivElement | null) => {
                          itemRefs.current[childNav.key] = el;
                        }}
                        data-key={searchParams.size !== 0 ? `${childUrl}?${searchParams.toString()}` : childUrl}
                      >
                        {childDisabled ? (
                          <span className="cursor-not-allowed opacity-60">{t(childNav.title)}</span>
                        ) : (
                          <Link to={searchParams.size !== 0 ? `${childUrl}?${searchParams.toString()}` : childUrl}>
                            {t(childNav.title)}
                          </Link>
                        )}
                      </div>
                    </Tooltip>
                  ),
                  title: t(childNav.title),
                };
              }),
          };
        })}
      />
    </div>
  );
};

export default SiderMenu;
