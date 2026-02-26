import { Button, message, Modal } from 'antd';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Edge, Node, useEdgesState, useNodesState } from '@xyflow/react';
import {
  ArchetypeInfo,
  createArchetype,
  getArchetypeDetails,
  updateArchetype,
} from '@app/api/archetypes.api';
import { ArchetypeNameStep } from '@app/components/database-mapping/modal/steps/ArchetypeNameStep';
import { CreateTemplateStep } from '@app/components/database-mapping/modal/steps/CreateTemplateStep';
import { ColumnMappingStep } from '@app/components/database-mapping/modal/steps/ColumnMappingStep';
import { SetPermissionsStep } from '@app/components/database-mapping/modal/steps/SetPermissionsStep';
import { WizardStepHeader } from '@app/components/database-mapping/wizard/WizardStepHeader';
import {
  findDuplicateChildLabels,
  findUnmappedLeafs,
  findOrphanedNodes,
  findEmptyLabels,
  findColumnIntegrityIssues,
  findMixedChildrenNodes,
  findEmptyRoot,
  findDuplicateEdges,
  permissionsFromChecked,
  permissionsToCheckedByCol,
} from '@app/utils/reactflow/helpers';
import { CheckedByCol, usePermissionTable } from '@app/hooks/usePermissionTable';
import { useArchetypeModalContext } from '@app/hooks/useArchetypeModalContext';
import { ArchetypeModalProvider } from '@app/providers/ArchetypeModalProvider';

const initialNodes: Node[] = [
  {
    id: Date.now().toString(36),
    position: { x: 320, y: 200 },
    data: { label: 'Main Entity', level: 0 },
    type: 'root',
    deletable: false,
  },
];

const ArchetypeWizardContent = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const archetypeId = searchParams.get('archetypeId') ?? undefined;
  const isEditing = !!archetypeId;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { forms, columns, setColumns, fetchColumns, fetchTables } = useArchetypeModalContext();
  const [form] = forms;

  const [step, setStep] = useState(0);
  const [isFormLoading, setFormLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [checkedByCol, setCheckedByCol] = useState<CheckedByCol>({
    high: { parent: {}, leaf: {} },
    detail: { parent: {}, leaf: {} },
    none: { parent: {}, leaf: {} },
  });

  const { childrenById, topKeys } = usePermissionTable(nodes, edges, checkedByCol, setCheckedByCol);
  const archetypeRef = useRef<ArchetypeInfo | undefined>(undefined);
  const draftIdRef = useRef<string | undefined>(archetypeId);

  // Fetch columns + tables on mount (via provider)
  useEffect(() => {
    if (!projectId) return;
    fetchColumns(projectId);
    fetchTables(projectId);
  }, [projectId, fetchColumns, fetchTables]);

  // Load archetype data in edit mode
  useEffect(() => {
    if (!isEditing || !projectId || !archetypeId) return;
    let cancelled = false;

    getArchetypeDetails(projectId, archetypeId).then((a) => {
      if (cancelled) return;
      archetypeRef.current = a;
      form.setFieldsValue({ name: a.name ?? '' });
      setNodes((a.nodes && a.nodes.length > 0 ? a.nodes : initialNodes) as Node[]);
      setEdges((a.edges ?? []) as Edge[]);
      const { checkedByCol: restored } = permissionsToCheckedByCol(a.permissions || [], a.nodes, a.edges);
      setCheckedByCol(restored);
    }).catch(console.error);

    return () => { cancelled = true; };
  }, [isEditing, projectId, archetypeId, form, setNodes, setEdges]);

  const clearPermissionsFor = (ids: Set<string>) => {
    if (!ids.size) return;
    setCheckedByCol((prev) => {
      const next = {
        high: { parent: { ...prev.high.parent }, leaf: { ...prev.high.leaf } },
        detail: { parent: { ...prev.detail.parent }, leaf: { ...prev.detail.leaf } },
        none: { parent: { ...prev.none.parent }, leaf: { ...prev.none.leaf } },
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

  const stepTitles = [
    t('project.createTemplate.form.step1.title'),
    t('project.createTemplate.form.step2.title'),
    t('project.createTemplate.form.step3.title'),
    t('project.createTemplate.form.step4.title'),
  ];

  const buildFormData = () => {
    const permissions = permissionsFromChecked(checkedByCol, childrenById, topKeys);
    return {
      archetypeId: archetypeRef.current?.archetypeId ?? archetypeId,
      projectId,
      name: form.getFieldValue('name'),
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

  const autoSaveDraft = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const payload = { ...buildFormData(), status: 'DRAFT' as const };
      if (isEditing && archetypeId) {
        await updateArchetype(projectId, archetypeId, payload as ArchetypeInfo);
      } else {
        await createArchetype(payload as ArchetypeInfo);
      }
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, nodes, edges, checkedByCol, childrenById, topKeys, form]);

  const onSaveDraft = async () => {
    try {
      await autoSaveDraft();
      message.success(t('project.createTemplate.form.draft.success'));
    } catch {
      message.error(t('project.createTemplate.form.draft.failed'));
    }
  };

  const nextStep = async () => {
    let duplicateGroups: ReturnType<typeof findDuplicateChildLabels> = [];
    let missingLeafs: string[] = [];
    let orphaned: string[] = [];
    let emptyLabelIds: string[] = [];
    let columnIssues: ReturnType<typeof findColumnIntegrityIssues> = [];
    let mixed: string[] = [];
    let isEmptyRoot = false;
    let dupEdges: ReturnType<typeof findDuplicateEdges> = [];

    if (step === 0) {
      try {
        await form.validateFields();
      } catch {
        return;
      }
    }

    if (step === 1 || step === 2) {
      duplicateGroups = findDuplicateChildLabels(nodes, edges);
      orphaned = findOrphanedNodes(nodes, edges);
      emptyLabelIds = findEmptyLabels(nodes);
      mixed = findMixedChildrenNodes(nodes, edges);
      isEmptyRoot = findEmptyRoot(nodes, edges);
      dupEdges = findDuplicateEdges(edges);
    }

    if (step === 2) {
      missingLeafs = findUnmappedLeafs(nodes, edges);
      columnIssues = findColumnIntegrityIssues(nodes, edges);
    }

    const hasIssues =
      duplicateGroups.length > 0 ||
      missingLeafs.length > 0 ||
      orphaned.length > 0 ||
      emptyLabelIds.length > 0 ||
      columnIssues.length > 0 ||
      mixed.length > 0 ||
      isEmptyRoot ||
      dupEdges.length > 0;

    if (hasIssues) {
      Modal.warning({
        title: t('project.createTemplate.form.step3.validation.title'),
        width: 520,
        styles: { body: { padding: '16px 24px 24px' } },
        content: (
          <div className="flex flex-col gap-4 mt-2">
            {isEmptyRoot && (
              <div className="text-sm">
                {t('project.createTemplate.form.step3.validation.emptyRoot')}
              </div>
            )}
            {emptyLabelIds.length > 0 && (
              <div className="text-sm">
                {t('project.createTemplate.form.step3.validation.emptyLabels', {
                  count: emptyLabelIds.length,
                })}
              </div>
            )}
            {orphaned.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">
                  {t('project.createTemplate.form.step3.validation.orphanedNodes')}
                </div>
                <ul className="pl-5 text-sm list-disc">
                  {orphaned.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
            {duplicateGroups.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">
                  {t('project.createTemplate.form.step3.validation.duplicateLabels.title')}
                </div>
                <ul className="pl-5 text-sm list-disc">
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
                        <div className="pl-4 mt-1">
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
              </div>
            )}
            {mixed.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">
                  {t('project.createTemplate.form.step3.validation.mixedChildren')}
                </div>
                <ul className="pl-5 text-sm list-disc">
                  {mixed.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
            {columnIssues.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">
                  {t('project.createTemplate.form.step3.validation.columnIntegrity.title')}
                </div>
                <ul className="pl-5 text-sm list-disc">
                  {columnIssues.map((issue) => (
                    <li key={issue.columnId}>
                      {t('project.createTemplate.form.step3.validation.columnIntegrity.detail', {
                        name: issue.columnLabel,
                        count: issue.parentCount,
                      })}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {missingLeafs.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">
                  {t('project.createTemplate.form.step3.validation.missingLeafs')}
                </div>
                <ul className="pl-5 text-sm list-disc">
                  {missingLeafs.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
            {dupEdges.length > 0 && (
              <div className="text-sm">
                {t('project.createTemplate.form.step3.validation.duplicateEdges', {
                  count: dupEdges.length,
                })}
              </div>
            )}
          </div>
        ),
      });
      return;
    }

    setStep(Math.min(step + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setFormLoading(true);
    const formData = { ...buildFormData(), status: 'ACTIVE' as const };
    try {
      let jobId: string | undefined;
      if (!isEditing) {
        const result = await createArchetype(formData as ArchetypeInfo);
        jobId = result.jobId;
      } else {
        if (!archetypeId) return;
        const result = await updateArchetype(projectId, archetypeId, { ...formData, archetypeId } as ArchetypeInfo);
        jobId = result.jobId;
      }
      navigate(`/project/db-mapping?id=${projectId}`, {
        state: { jobId, archetypeName: formData.name },
      });
    } catch (error) {
      console.error('Failed to submit archetype:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleExit = () => {
    Modal.confirm({
      title: t('project.createTemplate.wizard.exitConfirm.title'),
      content: t('project.createTemplate.wizard.exitConfirm.description'),
      okText: t('project.createTemplate.wizard.exit'),
      cancelText: t('common.back'),
      onOk: () => navigate(`/project/db-mapping?id=${projectId}`),
    });
  };

  const handleGraphGenerated = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      setNodes(newNodes);
      setEdges(newEdges);
    },
    [setNodes, setEdges],
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return <ArchetypeNameStep form={form} />;
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
            name={form.getFieldValue('name')}
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
            name={form.getFieldValue('name')}
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
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <WizardStepHeader
        currentStep={step}
        stepTitles={stepTitles}
        onSaveDraft={onSaveDraft}
        onExit={handleExit}
        saveStatus={saveStatus}
      />

      <div className="flex-1 overflow-auto">{renderStep()}</div>

      <div className="flex items-center justify-between w-full px-6 py-3 border-t border-grey-3 bg-white shrink-0">
        <div>
          {step > 0 && (
            <Button
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
          {step < 3 ? (
            <Button
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
    </div>
  );
};

const ArchetypeWizardPage = () => {
  const [searchParams] = useSearchParams();
  const archetypeId = searchParams.get('archetypeId');

  return (
    <ArchetypeModalProvider mode={archetypeId ? 'edit' : 'create'}>
      <ArchetypeWizardContent />
    </ArchetypeModalProvider>
  );
};

export default ArchetypeWizardPage;
