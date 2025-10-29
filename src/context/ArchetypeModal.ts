import { ColumnInfo } from '@app/api/database.api';
import { FormInstance } from 'antd';
import { createContext } from 'react';

export type ModalMode = 'create' | 'edit';

type ArchetypeModalContextType = {
  mode: ModalMode;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalStep: number;
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  handleDraft: (formData: unknown) => void;
  showModal: () => void;
  forms: FormInstance<unknown>[];
  columns: ColumnInfo[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnInfo[]>>;
  fetchColumns: (projectId: string) => void;
} | null;
export const ArchetypeModalContext = createContext<ArchetypeModalContextType>(null);
