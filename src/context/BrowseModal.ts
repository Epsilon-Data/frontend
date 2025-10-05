import { ProjectInfo } from '@app/api/projects.api';
import { FormInstance } from 'antd';
import { createContext } from 'react';

type BrowseModalContextType = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalStep: number;
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  showModal: (projectId: string) => void;
  form: FormInstance<unknown>;
  project: ProjectInfo;
  isModalLoading: boolean;
} | null;
export const BrowseModalContext = createContext<BrowseModalContextType>(null);
