import { FormInstance } from 'antd';
import { createContext } from 'react';

type DatabaseModalContextType = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalStep: number;
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  showModal: () => void;
  forms: FormInstance<unknown>[];
} | null;
export const DatabaseModalContext = createContext<DatabaseModalContextType>(null);
