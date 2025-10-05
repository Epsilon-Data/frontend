import { Button, Tabs, TabsProps } from 'antd';
import { DetailsRow } from './DetailsRow';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { ProjectInfo } from '@app/api/projects.api';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

type AboutTabsProps = {
  project: ProjectInfo;
};

export const AboutTabs = ({ project }: AboutTabsProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      const isOverflowing = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setShowToggle(isOverflowing);
    }
  }, [project.description]);

  const items: TabsProps['items'] = [
    {
      key: 'about',
      label: t('browse.main.details.about.title'),
      children: (
        <>
          <div
            ref={descriptionRef}
            className={clsx('relative overflow-hidden break-normal', isExpanded ? 'line-clamp-none' : 'line-clamp-6')}
          >
            {project.description}
          </div>
          {showToggle && (
            <Button
              className="border-none shadow-none text-blueDark text-xs font-medium font-inter cursor-pointer mt-2 p-0 inline-flex items-center gap-2"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? t('browse.main.details.about.showLess') : t('browse.main.details.about.showMore')}
              {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
            </Button>
          )}
        </>
      ),
    },
    {
      key: 'details',
      label: t('browse.main.details.projectDetails.title'),
      children: (
        <>
          <DetailsRow title={t('browse.main.details.projectDetails.info.university')} content={project.university} />
          <DetailsRow title={t('browse.main.details.projectDetails.info.faculty')} content={project.faculty} />
          <DetailsRow title={t('browse.main.details.projectDetails.info.ethicsId')} content={project.ethicsId} />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.duration')}
            content={
              project.startDate && project.endDate
                ? `${new Date(project.startDate).getDate()} ${new Date(project.startDate).toLocaleString('en-GB', {
                    month: 'long',
                  })}, ${new Date(project.startDate).getFullYear()} - ${new Date(project.endDate).getDate()} ${new Date(
                    project.endDate,
                  ).toLocaleString('en-GB', {
                    month: 'long',
                  })}, ${new Date(project.endDate).getFullYear()}`
                : t('browse.main.details.projectDetails.info.notAvailable')
            }
          />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.participantsNum')}
            content={project.participantsNum}
          />
          <DetailsRow title={t('browse.main.details.projectDetails.info.lead')} content={project.lead} />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.members')}
            content={
              project.members
                ? JSON.parse(project.members)
                    .map((member: { email: string; role: string }) => {
                      return `${member.email} (${member.role})`;
                    })
                    .join(', ')
                : t('browse.main.details.projectDetails.info.notAvailable')
            }
          />
        </>
      ),
    },
  ];
  return <Tabs className="details-tabs" defaultActiveKey="about" items={items} />;
};
