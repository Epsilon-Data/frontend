// provider/FlowProvider.tsx
import React, { Dispatch, SetStateAction } from 'react';
import { ArchetypeFlowContext, FlowMode } from '@app/context/ArchetypeFlow';
import { BG_VARIANT, REACT_FLOW_OPTIONS } from '@app/constants/reactflow/reactflowOptions';
import { editableNodeTypes, mappingNodeTypes, readonlyNodeTypes } from '@app/constants/reactflow/nodeTypes';
import { isValidEdgeBase } from '@app/constants/reactflow/edgeRules';
import { enhanceMappingNodes } from '@app/constants/reactflow/mappingHelpers';
import { MapEdge, MapEdgeProps } from '@app/components/reactflow-components/MapEdge/MapEdge';
import type { Edge, Node } from 'reactflow';

type Props = React.PropsWithChildren<{
  mode: FlowMode;
  columns?: string[];
  setColumns?: React.Dispatch<React.SetStateAction<string[]>>;
}>;

export const ArchetypeFlowProvider: React.FC<Props> = ({ mode, columns, setColumns, children }) => {
  const contextValue =
    mode === 'mapping'
      ? {
          mode,
          nodeTypes: mappingNodeTypes,
          edgeTypes: { default: (p: MapEdgeProps) => <MapEdge {...p} mode="mapping" /> },
          isValidEdge: isValidEdgeBase,
          enhanceNodes: enhanceMappingNodes,
          onConnectPost: ({
            source,
            target,
            setEdges,
          }: {
            source: Node;
            target: Node;
            setEdges: Dispatch<SetStateAction<Edge[]>>;
          }) => {
            const isSubcatColumn =
              (source.type === 'subcategory' && target.type === 'column') ||
              (source.type === 'column' && target.type === 'subcategory');
            if (!isSubcatColumn) return;
            setEdges((eds: Edge[]) =>
              eds.filter(
                (e) =>
                  e.source !== source.id && e.target !== source.id && e.source !== target.id && e.target !== target.id,
              ),
            );
          },
          columns,
          setColumns,
          options: REACT_FLOW_OPTIONS,
          bgVariant: BG_VARIANT,
        }
      : mode === 'readonly'
      ? {
          mode,
          nodeTypes: readonlyNodeTypes,
          edgeTypes: { default: (p: MapEdgeProps) => <MapEdge {...p} mode="readonly" /> },
          isValidEdge: isValidEdgeBase,
          options: REACT_FLOW_OPTIONS,
          bgVariant: BG_VARIANT,
        }
      : {
          mode,
          nodeTypes: editableNodeTypes,
          edgeTypes: { default: (p: MapEdgeProps) => <MapEdge {...p} mode="editable" /> },
          isValidEdge: isValidEdgeBase,
          options: REACT_FLOW_OPTIONS,
          bgVariant: BG_VARIANT,
        };

  return <ArchetypeFlowContext.Provider value={contextValue}>{children}</ArchetypeFlowContext.Provider>;
};
