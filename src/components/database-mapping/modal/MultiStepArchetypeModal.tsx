import { Button, message, Modal } from 'antd';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalStepHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { useArchetypeModalContext } from '@app/hooks/useArchetypeModalContext';
import { Edge, Node, useEdgesState, useNodesState } from '@xyflow/react';
import { Archetype, ArchetypeInfo, createArchetype, updateArchetype } from '@app/api/archetypes.api';
import { ArchetypeNameStep } from './steps/ArchetypeNameStep';
import { CreateTemplateStep } from './steps/CreateTemplateStep';
import { ColumnMappingStep } from './steps/ColumnMappingStep';
import { SetPermissionsStep } from './steps/SetPermissionsStep';
import {
  findDuplicateChildLabels,
  findUnmappedLeafs,
  permissionsFromChecked,
  permissionsToCheckedByCol,
} from '@app/utils/reactflow/helpers';
import { CheckedByCol, usePermissionTable } from '@app/hooks/usePermissionTable';
import { useAppSelector } from '@app/hooks/reduxHooks';

type MultiStepArchetypeModalProps = {
  archetype?: ArchetypeInfo | undefined;
  fetchArchetypes: () => Promise<void>;
  projectId: string;
  addArchetype?: (archetype: Archetype) => void;
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
  addArchetype,
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
    none: { parent: {}, leaf: {} },
  });
  const { childrenById, topKeys } = usePermissionTable(nodes, edges, checkedByCol, setCheckedByCol);
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.user);

  const isEditing = useMemo(() => Object.keys(archetype || {}).length != 0, [archetype]);

  const clearPermissionsFor = (ids: Set<string>) => {
    if (!ids.size) return;

    setCheckedByCol((prev) => {
      const next = {
        high: {
          parent: { ...prev.high.parent },
          leaf: { ...prev.high.leaf },
        },
        detail: {
          parent: { ...prev.detail.parent },
          leaf: { ...prev.detail.leaf },
        },
        none: {
          parent: { ...prev.none.parent },
          leaf: { ...prev.none.leaf },
        },
      };

      for (const id of ids) {
        delete next.high.parent[id];
        delete next.high.leaf[id];
        delete next.detail.parent[id];
        delete next.detail.leaf[id];
      }
      return next;
    });
  };

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
      const { checkedByCol } = permissionsToCheckedByCol(a.permissions || [], a.nodes, a.edges);
      setCheckedByCol(checkedByCol);
    } else {
      step1?.resetFields?.();
      setNodes(initialNodes);
      setEdges([]);
      setCheckedByCol({
        high: { parent: {}, leaf: {} },
        detail: { parent: {}, leaf: {} },
        none: { parent: {}, leaf: {} },
      });
    }
  }, [isModalOpen, isEditing, archetype, setNodes, setEdges, step1]);

  const nextStep = async () => {
    let duplicateGroups: ReturnType<typeof findDuplicateChildLabels> = [];
    let missingLeafs: string[] = [];
    if (modalStep === 0) {
      try {
        await forms[0].validateFields();
      } catch {
        return;
      }
    }

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

  const prevStep = () => setModalStep((prev) => Math.max(prev - 1, 0));

  const stepTitles = [
    t('project.createTemplate.form.step1.title'),
    t('project.createTemplate.form.step2.title'),
    t('project.createTemplate.form.step3.title'),
    t('project.createTemplate.form.step4.title'),
  ];

  const buildFormData = () => {
    const permissions = permissionsFromChecked(checkedByCol, childrenById, topKeys);
    return {
      archetypeId: archetype?.archetypeId,
      projectId,
      name: step1.getFieldValue('name'),
      nodes: nodes.map((node) => ({
        id: node.id,
        data: { label: node.data.label, level: node.data.level },
        position: { x: node.position.x, y: node.position.y },
        type: node.type,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
      permissions,
    };
  };

  const onSaveDraft = async () => {
    let payload = { ...buildFormData(), status: 'DRAFT' as const };
    if (archetype?.archetypeId) {
      payload = { ...payload, archetypeId: archetype.archetypeId };
    }

    try {
      handleDraft(payload);
      message.success(t('project.createTemplate.form.draft.success'));
    } catch {
      message.error(t('dashboard.createTemplate.form.draft.failed'));
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    const formData = { ...buildFormData(), status: 'ACTIVE' as const };
    try {
      if (!isEditing) {
        console.log('Creating archetype with data:', formData);
        await createArchetype(formData);
        // Optimistic update: add the new archetype to the list immediately
        if (addArchetype) {
          addArchetype({
            id: '',
            lastModified: new Date(),
            created: new Date(),
            createdBy: user?.sub,
            name: formData.name,
            status: 'ACTIVE',
          } as Archetype);
        }
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

  const handleGraphGenerated = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      setNodes(newNodes);
      setEdges(newEdges);
    },
    [setNodes, setEdges],
  );

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
            onNodesDeleted={clearPermissionsFor}
            projectId={projectId}
            onGraphGenerated={handleGraphGenerated}
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
            onNodesDeleted={clearPermissionsFor}
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
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            {modalStep > 0 && (
              <Button
                key="back"
                onClick={prevStep}
                disabled={isFormLoading}
                icon={<IoChevronBackOutline />}
                className="flex items-center h-9 text-blueDark text-xs font-medium font-inter"
              >
                {t('common.back')}
              </Button>
            )}
          </div>
          <div>
            {modalStep < 3 ? (
              <Button
                key="next"
                type="primary"
                onClick={nextStep}
                icon={<IoChevronForwardOutline />}
                iconPlacement="end"
                className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
              >
                {t('common.next')}
              </Button>
            ) : (
              <Button
                key="submit"
                type="primary"
                onClick={handleSubmit}
                icon={<IoChevronForwardOutline />}
                iconPlacement="end"
                loading={isFormLoading}
                className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
              >
                {t('project.createTemplate.form.submit')}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        <ModalStepHeader modalStep={modalStep} handleDraft={onSaveDraft} stepTitles={stepTitles} />
        {renderStep()}
      </div>
    </Modal>
  );
};
