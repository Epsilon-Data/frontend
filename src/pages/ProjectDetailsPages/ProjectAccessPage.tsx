import { useProjectContext } from '@app/hooks/useProjectContext';
import { Breadcrumb, Drawer } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

const ProjectAccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const { t } = useTranslation();
  const { project } = useProjectContext();
  const [openDrawer, setOpenDrawer] = React.useState(true);
  // const { requests, tableLoading, fetchRequests } = useAccessRequests(projectId);
  // const [request, setRequest] = useState<AnalysisRequest | null>(null);

  const breadcrumbItems = [
    { title: <Link to="/">{t('project.breadcrumb.home')}</Link> },
    { title: project?.name || '' },
    { title: <Link to={`/project/access?id=${projectId}`}>{t('project.breadcrumb.projectAccess')}</Link> },
  ];

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <Breadcrumb separator=">" className="my-4" items={breadcrumbItems} />
      <div className="flex items-start w-full mt-8 pb-4 mb-4 border-b border-grey-3">
        <div className="text-xl font-medium font-sans">{t('project.main.projectAccess.title')}</div>
      </div>
      <Drawer size={640} placement="right" closable={false} onClose={() => setOpenDrawer(false)} open={openDrawer}>
        <p className="border-b border-grey-3 mb-2">{t('project.main.projectAccess.title')}</p>
      </Drawer>
    </div>
  );
};

export default ProjectAccessPage;
