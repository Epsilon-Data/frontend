import { FormInstance } from 'antd';
import { createContext } from 'react';

type ArchetypeModalContextType = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalStep: number;
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  handleDraft: () => void;
  showModal: () => void;
  forms: FormInstance<unknown>[];
} | null;
export const ArchetypeModalContext = createContext<ArchetypeModalContextType>(null);
