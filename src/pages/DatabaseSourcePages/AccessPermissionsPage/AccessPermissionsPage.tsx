/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './AccessPermissionsPage.styles';
import { useParams } from 'react-router-dom';
import { useMounted } from '@app/hooks/useMounted';
import { addAccessPermissions, getAccessPermissions, getProjectId, getTemplate } from '@app/api/databaseSources.api';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import ReactFlow, { Node, ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import { PermissionNode } from '@app/components/reactflow-components/PermissionNode/PermissionNode';
import { MapEdge } from '@app/components/reactflow-components/MapEdge/MapEdge';
import { notificationController } from '@app/controllers/notificationController';
import 'reactflow/dist/style.css';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { RolePermissions } from '@app/interfaces/interfaces';
import { PermissionsModal } from './PermissionsModal/PermissionsModal';
import { ClearModal } from './ClearModal/ClearModal';
import { BsExclamationSquareFill } from 'react-icons/bs';

const initialPermissions = [
  { role: 'research', access: [] },
  { role: 'govOrg', access: [] },
  { role: 'others', access: [] },
];
export const AccessPermissionsPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const [projectId, setProjectId] = useState('');
  const [activeTabKey, setActiveTabKey] = useState('research');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Array<CheckboxValueType>>([]);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissions, setPermissions] = useState<RolePermissions[]>(initialPermissions);
  const [clickedNode, setClickedNode] = useState<Node>();
  const rolePermissions = permissions.find((permission) => permission.role == activeTabKey);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const [encapsulatingNode, setEncapsulatingNode] = useState('');
  const [isForbidSetting, setIsForbidSetting] = useState(false);

  const nodeTypes = useMemo(
    () => ({ object: PermissionNode, category: PermissionNode, subcategory: PermissionNode }),
    [],
  );
  const edgeTypes = useMemo(() => ({ default: MapEdge }), []);

  const fetch = useCallback(
    (id: string | undefined) => {
      getProjectId(id).then((res) => {
        if (isMounted.current) {
          setProjectId(res);
        }
      });
      getTemplate(id).then((res) => {
        if (res) {
          setNodes(res.nodes);
          setEdges(res.edges);
        }
      });
      getAccessPermissions(id).then((res) => {
        if (res) {
          setPermissions(res);
        }
      });
    },
    [isMounted, setEdges, setNodes],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

  const tabList = [
    {
      key: 'research',
      label: t('databaseSources.accessPermissions.research'),
    },
    {
      key: 'govOrg',
      label: t('databaseSources.accessPermissions.govOrg'),
    },
    {
      key: 'others',
      label: t('databaseSources.accessPermissions.others'),
    },
  ];

  const permissionOptions = [
    { label: t('databaseSources.accessPermissions.permission.viewAggregated'), value: 'viewAggregated' },
    { label: t('databaseSources.accessPermissions.permission.performAnalysis'), value: 'performAnalysis' },
  ];

  const handleCheckboxChange = (checkedValues: Array<CheckboxValueType>) => {
    let containsNode = false;
    rolePermissions?.access.map((access) => {
      if (access.nodeId == clickedNode?.id) {
        access.permissions = checkedValues.map((value) => value.toString());
        containsNode = true;
      }
    });

    if (!containsNode && clickedNode && clickedNode.type) {
      rolePermissions?.access.push({
        nodeId: clickedNode.id,
        nodeName: clickedNode.data.label,
        nodeType: clickedNode.type,
        permissions: checkedValues.map((value) => value.toString()),
      });
    }
    setSelectedPermissions(checkedValues);
  };

  const handleTabChange = (key: string) => {
    setShowPermissions(false);
    setActiveTabKey(key);
  };

  const handleNodeClick = (e: any) => {
    const node = nodes.find((node) => node.id == e.target.id);
    if (!node) return;
    if (showPermissions && node.data.label == clickedNode?.data.label) {
      setShowPermissions(false);
      return;
    }

    const offsets = e.target.getBoundingClientRect();
    const scrolled = document.getElementById('main-content')?.scrollTop || 0;
    setPosition({ top: offsets.top + scrolled - 170, left: offsets.left - offsets.width });
    setClickedNode(node);

    if (node.type == 'subcategory') {
      const categoryEdge = edges.find((e) => e.source === node.id || e.target === node.id);
      if (categoryEdge) {
        const connectedCategoryId = categoryEdge.source === node.id ? categoryEdge.target : categoryEdge.source;
        const connectedCategoryEdges = edges.filter(
          (e) => e.source === connectedCategoryId || e.target === connectedCategoryId,
        );
        const subcategoryCount = connectedCategoryEdges.reduce((count, edge) => {
          const connectedId = edge.source === connectedCategoryId ? edge.target : edge.source;
          const connectedNode = nodes.find((n) => n.id === connectedId && n.type === 'subcategory');
          return connectedNode ? count + 1 : count;
        }, 0);

        if (subcategoryCount == 1) {
          const categoryName = nodes.find((n) => n.id === connectedCategoryId)?.data.label;
          setIsForbidSetting(true);
          setEncapsulatingNode(categoryName);
          setShowPermissions(true);
          return;
        }
      }
    }

    const nodePermissions = rolePermissions?.access.find((access) => access.nodeId == node.id)?.permissions;
    if (!nodePermissions) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(nodePermissions);
    }

    setIsForbidSetting(false);
    setShowPermissions(true);
  };

  const handleSubmit = (selectedRole: string, checkedRoles: Array<CheckboxValueType>) => {
    setSubmitLoading(true);
    if (permissions.every((permission) => permission.access.length === 0)) {
      notificationController.error({
        message: t('databaseSources.accessPermissions.notify.noPermissionsSet'),
      });
      setSubmitLoading(false);
      setIsPermissionsModalOpen(false);
      return;
    }

    const accessToBeCopied = permissions.find((permission) => permission.role == selectedRole)?.access;
    permissions.forEach((permission) => {
      if (checkedRoles.includes(permission.role) && accessToBeCopied) {
        permission.access = accessToBeCopied;
      }
    });

    addAccessPermissions(id, JSON.stringify(permissions))
      .then(() => {
        notificationController.success({
          message: t('databaseSources.accessPermissions.notify.saveSuccess', {
            role: t('databaseSources.accessPermissions.' + activeTabKey),
          }),
        });
      })
      .catch(() => {
        notificationController.error({
          message: t('databaseSources.accessPermissions.notify.saveFailed'),
        });
      });
    setSubmitLoading(false);
    setIsPermissionsModalOpen(false);
  };

  const handleClear = (checkedRoles: Array<CheckboxValueType>) => {
    checkedRoles.forEach((role) => {
      permissions.forEach((permission) => {
        if (role == permission.role) {
          permission.access = [];
        }
      });
    });

    if (checkedRoles.length == 0) {
      notificationController.info({ message: t('databaseSources.accessPermissions.notify.noneCleared') });
    } else {
      notificationController.success({ message: t('databaseSources.accessPermissions.notify.clearSuccess') });
    }

    setIsClearModalOpen(false);
  };

  return (
    <>
      <PageTitle>{t('databaseSources.accessPermissions.projectTitle', { id: projectId })}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="access-permissions"
          title={t('databaseSources.accessPermissions.projectTitle', { id: projectId })}
          padding="1.25rem 1.25rem 0"
          tabList={tabList}
          activeTabKey={activeTabKey}
          onTabChange={handleTabChange}
          tabProps={{ size: 'middle' }}
        >
          {nodes.length > 0 ? (
            <>
              <BaseRow>
                <ReactFlowProvider>
                  <S.MapWrapper>
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onNodeClick={handleNodeClick}
                      edgesUpdatable={false}
                      edgesFocusable={false}
                      nodesDraggable={false}
                      nodesConnectable={false}
                      nodesFocusable={false}
                      draggable={false}
                      zoomOnScroll={false}
                      panOnDrag={false}
                      zoomOnDoubleClick={false}
                      deleteKeyCode={[]}
                      nodeTypes={nodeTypes}
                      edgeTypes={edgeTypes}
                      nodeOrigin={[0.5, 0.5]}
                      fitView
                      fitViewOptions={{ maxZoom: 1.2 }}
                    ></ReactFlow>
                  </S.MapWrapper>
                </ReactFlowProvider>
                <S.PermissionsPopover
                  title={t('databaseSources.accessPermissions.permissionModal.title', {
                    node: clickedNode?.data.label,
                  })}
                  style={{ top: position?.top, left: position?.left }}
                  hidden={!showPermissions}
                >
                  {isForbidSetting ? (
                    <S.PermissionsMessage>
                      {t('databaseSources.accessPermissions.permissionModal.message', { node: encapsulatingNode })}
                    </S.PermissionsMessage>
                  ) : (
                    <S.PermissionsCheckboxGroup
                      options={permissionOptions}
                      value={selectedPermissions}
                      onChange={handleCheckboxChange}
                    />
                  )}
                </S.PermissionsPopover>
              </BaseRow>
              <BaseRow style={{ padding: '1rem' }}>
                <BaseCol span={12} offset={12} style={{ display: 'flex' }}>
                  <BaseButton block type="default" onClick={() => setIsClearModalOpen(true)}>
                    {t('databaseSources.accessPermissions.clear')}
                  </BaseButton>
                  <BaseButton
                    block
                    type="primary"
                    onClick={() => setIsPermissionsModalOpen(true)}
                    style={{ marginLeft: '2rem' }}
                  >
                    {t('databaseSources.accessPermissions.save')}
                  </BaseButton>
                </BaseCol>
              </BaseRow>
            </>
          ) : (
            <>
              <S.InfoRow style={{ marginTop: '4rem' }}>
                <BsExclamationSquareFill style={{ width: '20%', height: '20%' }} />
              </S.InfoRow>
              <S.InfoRow>
                <S.InfoMessage>{t('databaseSources.accessPermissions.noArchetype')}</S.InfoMessage>
              </S.InfoRow>
            </>
          )}
          <PermissionsModal
            currentRole={activeTabKey}
            isModalOpen={isPermissionsModalOpen}
            setIsModalOpen={setIsPermissionsModalOpen}
            onSubmit={handleSubmit}
            loading={isSubmitLoading}
          />
          <ClearModal isModalOpen={isClearModalOpen} setIsModalOpen={setIsClearModalOpen} onClear={handleClear} />
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default AccessPermissionsPage;
