import { AccessRequestHeader } from '@app/components/access-requests/AccessRequestHeader';
import { MultiStepDatabaseModal } from '@app/components/access-requests/modal/MultiStepDatabaseModal';
import { RequestDetailsDrawer } from '@app/components/access-requests/RequestDetailsDrawer';
import { RequestTabs } from '@app/components/access-requests/RequestTabs';
import { updateProject } from '@app/api/projects.api';
import { useAccessRequests } from '@app/hooks/useAccessRequests';
import { useProjectContext } from '@app/hooks/useProjectContext';
import { DatabaseModalProvider } from '@app/providers/DatabaseModalProvider';
import { Breadcrumb, Switch, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

const ProjectAccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const { t } = useTranslation();
  const { project, updateProjectLocally } = useProjectContext();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [isPublicLoading, setIsPublicLoading] = useState(false);
  const { requests, request, drawerLoading, tableLoading, fetchRequests, fetchRequest, optimisticUpdateStatus } =
    useAccessRequests(projectId);

  useEffect(() => {
    const controller = new AbortController();
    fetchRequests();
    return () => controller.abort();
  }, [fetchRequests]);

  const handleIsPublicChange = async (checked: boolean) => {
    setIsPublicLoading(true);
    try {
      await updateProject({ isPublic: checked, projectId }, projectId);
      updateProjectLocally((prev) => (prev ? { ...prev, isPublic: checked } : prev));
      message.success(checked ? 'Project is now public' : 'Project is now private');
    } catch {
      message.error('Failed to update project visibility');
    } finally {
      setIsPublicLoading(false);
    }
  };

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
      <div className="flex items-center justify-between rounded-lg border border-grey-3 p-4 mb-6">
        <div className="flex flex-col">
          <div className="text-sm font-medium font-inter text-black">
            {t('dashboard.createProject.form.step1.isPublic.title')}
          </div>
          <div className="text-xs font-light font-inter text-black mt-1">
            {t('dashboard.createProject.form.step1.isPublic.description')}
          </div>
        </div>
        <Switch checked={project?.isPublic ?? false} onChange={handleIsPublicChange} loading={isPublicLoading} />
      </div>
      <AccessRequestHeader />
      <RequestTabs
        loading={tableLoading}
        accessRequests={requests}
        setOpenDrawer={setOpenDrawer}
        fetchRequest={fetchRequest}
      />
      <DatabaseModalProvider>
        <RequestDetailsDrawer
          open={openDrawer}
          setOpen={setOpenDrawer}
          request={request}
          drawerLoading={drawerLoading}
          onStatusChange={(requestId, status, type) => optimisticUpdateStatus(requestId, status, type)}
        />
        <MultiStepDatabaseModal
          fetchRequests={fetchRequests}
          requestId={request?.requestId ?? ''}
          projectId={projectId}
          mask
          closable={false}
          width={'60%'}
        />
      </DatabaseModalProvider>
    </div>
  );
};

export default ProjectAccessPage;
