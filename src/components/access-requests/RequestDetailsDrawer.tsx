import { AnalysisRequest } from '@app/api/analysisRequests.api';
import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';

type RequestDetailsDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  request: AnalysisRequest | null;
};
export const RequestDetailsDrawer = ({ open, setOpen, request }: RequestDetailsDrawerProps) => {
  const { t } = useTranslation();

  return (
    <Drawer
      size={640}
      placement="right"
      closable={true}
      onClose={() => setOpen(false)}
      open={open}
      title={t('project.main.projectAccess.title')}
    ></Drawer>
  );
};
