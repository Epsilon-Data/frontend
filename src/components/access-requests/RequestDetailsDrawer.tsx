import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';

type RequestDetailsDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  request?: any;
};
export const RequestDetailsDrawer = ({ open, setOpen }: RequestDetailsDrawerProps) => {
  const { t } = useTranslation();

  return (
    <Drawer size={640} placement="right" closable={true} onClose={() => setOpen(false)} open={open}>
      <p className="border-b border-grey-3 mb-2">{t('project.main.projectAccess.title')}</p>
    </Drawer>
  );
};
