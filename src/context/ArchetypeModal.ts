import { ColumnInfo } from '@app/api/database.api';
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
  columns: ColumnInfo[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnInfo[]>>;
  fetchColumns: (projectId: string) => void;
} | null;
export const ArchetypeModalContext = createContext<ArchetypeModalContextType>(null);
