import { ArchetypeInfo } from '@app/api/archetypes.api';
import { Member, ProjectInfo } from '@app/api/projects.api';
import { FormInstance } from 'antd';
import { createContext } from 'react';

type BrowseModalContextType = {
  archetype: ArchetypeInfo;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalStep: number;
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  showModal: (projectId: string) => void;
  form: FormInstance<unknown>;
  project: ProjectInfo;
  validateMembers: (members: Member[]) => {
    normalized: Member[];
    invalid: Member[];
    duplicates: Member[];
  };
} | null;
export const BrowseModalContext = createContext<BrowseModalContextType>(null);
