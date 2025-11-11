import { Button, Modal } from 'antd';
import { IoChevronForwardOutline } from 'react-icons/io5';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalStepHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { useArchetypeModalContext } from '@app/hooks/useArchetypeModalContext';
import { Edge, Node, useEdgesState, useNodesState } from '@xyflow/react';
import { ArchetypeInfo, createArchetype, updateArchetype } from '@app/api/archetypes.api';
import { ArchetypeNameStep } from './steps/ArchetypeNameStep';
import { CreateTemplateStep } from './steps/CreateTemplateStep';
import { ColumnMappingStep } from './steps/ColumnMappingStep';
import { SetPermissionsStep } from './steps/SetPermissionsStep';
import {
  findDuplicateChildLabels,
  findUnmappedLeafs,
  permissionsFromChecked,
  permissionsToCheckedByCol,
} from '@app/constants/reactflow/helpers';
import { CheckedByCol, usePermissionTable } from '@app/hooks/usePermissionTable';

type MultiStepArchetypeModalProps = {
  archetype?: ArchetypeInfo | undefined;
  fetchArchetypes: () => Promise<void>;
  projectId: string;
} & React.ComponentProps<typeof Modal>;

const initialNodes: Node[] = [
  {
    id: Date.now().toString(36),
    position: { x: 320, y: 200 },
    data: { label: 'Main Entity', level: 0 },
    type: 'root',
    deletable: false,
  },
];

export const MultiStepArchetypeModal = ({
  archetype,
  fetchArchetypes,
  projectId,
  ...modalProps
}: MultiStepArchetypeModalProps) => {
  const [isFormLoading, setFormLoading] = useState(false);
  const {
    modalStep,
    setModalStep,
    setIsModalOpen,
    isModalOpen,
    handleDraft,
    forms,
    columns,
    setColumns,
    fetchColumns,
  } = useArchetypeModalContext();

  const [step1] = forms;
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [checkedByCol, setCheckedByCol] = useState<CheckedByCol>({
    high: { parent: {}, leaf: {} },
    detail: { parent: {}, leaf: {} },
  });
  const { childrenById, topKeys } = usePermissionTable(nodes, edges, checkedByCol, setCheckedByCol);
  const { t } = useTranslation();

  const isEditing = useMemo(() => Object.keys(archetype || {}).length != 0, [archetype]);

  useEffect(() => {
    const controller = new AbortController();
    fetchColumns(projectId);
    return () => controller.abort();
  }, [fetchColumns, projectId]);

  useEffect(() => {
    if (!isModalOpen) return;

    if (isEditing) {
      const a = archetype as ArchetypeInfo;
      step1?.setFieldsValue?.({ name: a.name ?? '' });
      setNodes((a.nodes && a.nodes.length > 0 ? a.nodes : initialNodes) as Node[]);
      setEdges((a.edges ?? []) as Edge[]);
      setCheckedByCol(permissionsToCheckedByCol(a.permissions || [], a.nodes, a.edges));
    } else {
      step1?.resetFields?.();
      setNodes(initialNodes);
      setEdges([]);
      setCheckedByCol({ high: { parent: {}, leaf: {} }, detail: { parent: {}, leaf: {} } });
    }
  }, [isModalOpen, isEditing, archetype, setNodes, setEdges, step1]);

  const nextStep = () => {
    let duplicateGroups: ReturnType<typeof findDuplicateChildLabels> = [];
    let missingLeafs: string[] = [];

    if (modalStep === 1 || modalStep === 2) {
      duplicateGroups = findDuplicateChildLabels(nodes, edges);
    }

    if (modalStep === 2) {
      missingLeafs = findUnmappedLeafs(nodes, edges);
    }

    if (duplicateGroups.length || missingLeafs.length) {
      Modal.warning({
        title: t('project.createTemplate.form.step3.validation.title'),
        content: (
          <div>
            {duplicateGroups.length > 0 && (
              <>
                <div className="mb-2 font-medium">
                  {t('project.createTemplate.form.step3.validation.duplicateLabels.title')}
                </div>

                <ul className="mb-3 pl-4">
                  {duplicateGroups.map((g) => (
                    <li key={g.parentId} className="mb-2">
                      <div>
                        <strong>
                          {t('project.createTemplate.form.step3.validation.duplicateLabels.node', {
                            name: g.parentLabel,
                          })}
                        </strong>
                      </div>

                      {g.labels?.length > 0 && (
                        <div className="pl-4">
                          <div className="text-blueDark">
                            {t('project.createTemplate.form.step3.validation.duplicateLabels.siblings')}
                          </div>
                          <div className="font-light">{g.labels.join(', ')}</div>
                        </div>
                      )}

                      {g.conflictsWithParent?.length > 0 && (
                        <div className="pl-4 mt-1">
                          <div className="text-blueDark">
                            {t('project.createTemplate.form.step3.validation.duplicateLabels.parentConflict')}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {missingLeafs.length > 0 && (
              <>
                <div className="mb-2 font-medium">{t('project.createTemplate.form.step3.validation.missingLeafs')}</div>
                <ul style={{ paddingLeft: 18 }}>
                  {missingLeafs.map((name) => (
                    <li key={name}>• {name}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ),
      });
      return;
    }

    setModalStep((prev) => Math.min(prev + 1, 3));
  };

  const stepTitles = [
    t('project.createTemplate.form.step1.title'),
    t('project.createTemplate.form.step2.title'),
    t('project.createTemplate.form.step3.title'),
    t('project.createTemplate.form.step4.title'),
  ];

  const handleCreate = async () => {
    setFormLoading(true);
    const permissions = permissionsFromChecked(checkedByCol, childrenById, topKeys);

    const formData = {
      projectId: projectId,
      name: step1.getFieldValue('name'),
      nodes: nodes.map((node) => ({
        id: node.id,
        data: {
          label: node.data.label,
          level: node.data.level,
        },
        position: {
          x: node.position.x,
          y: node.position.y,
        },
        type: node.type,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
      permissions,
      status: 'DRAFT' as const,
    };

    try {
      if (!isEditing) {
        console.log('Creating archetype with data:', formData);
        await createArchetype(formData);
      } else {
        const archetypeId = archetype?.archetypeId;
        if (!archetypeId) {
          console.error('Cannot update archetype: missing archetypeId');
          return;
        }
        const updateData = { ...formData, archetypeId };
        console.log('Updating archetype with data:', updateData);
        await updateArchetype(projectId, archetypeId, updateData);
      }
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
            columns={columns}
            setColumns={setColumns}
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
        return (
          <SetPermissionsStep
            nodes={nodes}
            edges={edges}
            checkedByCol={checkedByCol}
            setCheckedByCol={setCheckedByCol}
          />
        );
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
          handleDraft={handleDraft}
          stepTitles={stepTitles}
        />
        {renderStep()}
      </div>
    </Modal>
  );
};
