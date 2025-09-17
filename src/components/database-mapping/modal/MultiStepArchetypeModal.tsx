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

// function checkDuplicateNames(nodes: Node[]) {
//   const nameSet = new Set();
//   const duplicateNames = new Set();

//   for (const node of nodes) {
//     if (nameSet.has(node.data.label)) {
//       duplicateNames.add(node.data.label);
//     }
//     nameSet.add(node.data.label);
//   }

//   if (duplicateNames.size > 0) {
//     return [...duplicateNames].join(', ');
//   } else {
//     return null;
//   }
// }

// function hasEmptyLabel(nodes: Node[]): boolean {
//   return nodes.some((node) => node.data.label.trim() === '');
// }

// function filterNodesEdges(nodes: Node[], edges: Edge[]) {
//   const filteredNodes: Node[] = [];
//   const filteredEdges: Edge[] = [];
//   let objectWithoutCategory = false;
//   let haveMultipleObjects = false;
//   let objectCount = 0;

//   function addNodeAndEdges(node: Node, edge: Edge) {
//     if (!filteredNodes.some((n) => n.id === node.id)) {
//       filteredNodes.push(node);
//     }
//     if (!filteredEdges.some((e) => e.id === edge.id)) {
//       filteredEdges.push(edge);
//     }
//   }

//   for (const node of nodes) {
//     if (node.type === 'object') {
//       objectCount++;
//       objectWithoutCategory = true;
//       filteredNodes.push(node);
//       for (const edge of edges) {
//         if (edge.source === node.id || edge.target === node.id) {
//           const subNode = nodes.find((n) => n.id === (edge.source === node.id ? edge.target : edge.source));
//           if (subNode) {
//             objectWithoutCategory = false;
//             addNodeAndEdges(subNode, edge);
//             for (const subEdge of edges) {
//               if (subEdge.source === subNode.id || subEdge.target === subNode.id) {
//                 const subcategoryNode = nodes.find(
//                   (n) => n.id === (subEdge.source === subNode.id ? subEdge.target : subEdge.source),
//                 );
//                 if (subcategoryNode) {
//                   addNodeAndEdges(subcategoryNode, subEdge);
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }

//   if (objectCount > 1) {
//     haveMultipleObjects = true;
//   }

//   return { objectWithoutCategory, haveMultipleObjects, filteredNodes, filteredEdges };
// }

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
