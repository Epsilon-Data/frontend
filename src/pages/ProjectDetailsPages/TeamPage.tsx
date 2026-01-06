import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjectContext } from '@app/hooks/useProjectContext';
import { Breadcrumb, Button } from 'antd';
import { TeamHeader } from '@app/components/team-settings/TeamHeader';
import { TeamMembers } from '@app/components/team-settings/TeamMembers';
import { Member } from '@app/api/projects.api';
import { FaPlus } from 'react-icons/fa6';

const TeamPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const { t } = useTranslation();
  const { project } = useProjectContext();
  const [teamMembers, setMembers] = useState<Member[]>(project?.members || []);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const breadcrumbItems = [
    { title: <Link to="/">{t('project.breadcrumb.home')}</Link> },
    { title: project?.name || '' },
    { title: <Link to={`/project/team?id=${projectId}`}>{t('project.breadcrumb.team')}</Link> },
  ];

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <Breadcrumb separator=">" className="my-4" items={breadcrumbItems} />
      <div className="flex items-center justify-between w-full mt-8 pb-4 mb-4 border-b border-grey-3">
        <div className="text-xl font-medium font-sans">{t('project.main.team.title')}</div>
        <Button
          className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
          type="primary"
          icon={<FaPlus />}
        >
          {t('project.main.team.invite')}
        </Button>
      </div>
      <TeamHeader projectName={project?.name || ''} numberOfMembers={teamMembers.length} />
      <TeamMembers loading={tableLoading} teamMembers={teamMembers} projectId={projectId} />
    </div>
  );
};

export default TeamPage;
