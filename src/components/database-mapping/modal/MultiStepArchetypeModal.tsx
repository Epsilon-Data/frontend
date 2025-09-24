import { Button, Modal } from 'antd';
import { IoChevronForwardOutline } from 'react-icons/io5';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalStepHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { useArchetypeModalContext } from '@app/hooks/useArchetypeModalContext';
import { useEdgesState, useNodesState } from 'reactflow';
import { createArchetype } from '@app/api/archetypes.api';
import { ArchetypeNameStep } from './steps/ArchetypeNameStep';
import { CreateTemplateStep } from './steps/CreateTemplateStep';
import { ColumnMappingStep } from './steps/ColumnMappingStep';
import { SetPermissionsStep } from './steps/SetPermissionsStep';

type MultiStepArchetypeModalProps = {
  fetchArchetypes: () => Promise<void>;
  projectId: string;
} & React.ComponentProps<typeof Modal>;

const initialNodes = [{ id: 'node_0', position: { x: 320, y: 200 }, data: { label: 'Object' }, type: 'object' }];

export const MultiStepArchetypeModal = ({
  fetchArchetypes,
  projectId,
  ...modalProps
}: MultiStepArchetypeModalProps) => {
  const [isFormLoading, setFormLoading] = useState(false);
  const { modalStep, setModalStep, setIsModalOpen, isModalOpen, handleDraft, forms } = useArchetypeModalContext();

  const [step1] = forms;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [columns, setColumns] = useState<string[]>([]);
  const { t } = useTranslation();

  const nextStep = () => setModalStep((prev) => Math.min(prev + 1, 4));

  const stepTitles = [
    t('project.createTemplate.form.step1.title'),
    t('project.createTemplate.form.step2.title'),
    t('project.createTemplate.form.step3.title'),
    t('project.createTemplate.form.step4.title'),
  ];

  const handleCreate = async () => {
    setFormLoading(true);
    //TODO: archetype and columnMapping formatting confirmation
    const formData = {
      projectId: projectId,
      name: step1.getFieldValue('name'),
      archetype: '',
      columnMapping: '',
    };

    try {
      console.log('Creating archetype with data:', formData);
      await createArchetype(formData);
      setIsModalOpen(false);
      await fetchArchetypes();
    } catch (error) {
      console.error('Archetype creation failed:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const renderStep = () => {
    switch (modalStep) {
      case 0:
        return <ArchetypeNameStep form={step1} />;
      case 1:
        return (
          <CreateTemplateStep
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            name={step1.getFieldValue('name')}
          />
        );
      case 2:
        return (
          <ColumnMappingStep
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            columns={columns}
            setColumns={setColumns}
            name={step1.getFieldValue('name')}
          />
        );
      case 3:
        return <SetPermissionsStep />;
      default:
        return null;
    }
  };

  return (
    <Modal
      maskClosable={true}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      {...modalProps}
      footer={[
        modalStep < 3 ? (
          <Button
            key="next"
            type="primary"
            onClick={nextStep}
            icon={<IoChevronForwardOutline />}
            iconPosition="end"
            className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
          >
            {t('common.next')}
          </Button>
        ) : (
          <Button
            key="submit"
            type="primary"
            onClick={handleCreate}
            icon={<IoChevronForwardOutline />}
            iconPosition="end"
            loading={isFormLoading}
            className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
          >
            {t('project.createTemplate.form.submit')}
          </Button>
        ),
      ]}
    >
      <div className="flex flex-col">
        <ModalStepHeader
          setModalStep={setModalStep}
          modalStep={modalStep}
          setIsModalOpen={setIsModalOpen}
          handleDraft={handleDraft}
          stepTitles={stepTitles}
        />
        {renderStep()}
      </div>
    </Modal>
  );
};
