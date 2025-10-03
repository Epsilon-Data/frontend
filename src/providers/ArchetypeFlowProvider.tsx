import React, { Dispatch, SetStateAction } from 'react';
import { ArchetypeFlowContext, FlowMode } from '@app/context/ArchetypeFlow';
import { BG_VARIANT, REACT_FLOW_OPTIONS } from '@app/constants/reactflow/reactflowOptions';
import { editableNodeTypes, mappingNodeTypes, readonlyNodeTypes } from '@app/constants/reactflow/nodeTypes';
import { isValidEdgeBase } from '@app/constants/reactflow/edgeRules';
import { MapEdge } from '@app/components/reactflow-components/MapEdge/MapEdge';
import type { Edge, EdgeTypes, Node } from 'reactflow';

const EDGE_TYPES: EdgeTypes = { default: MapEdge };

type Props = React.PropsWithChildren<{
  mode: FlowMode;
}>;

export const ArchetypeFlowProvider: React.FC<Props> = ({ mode, children }) => {
  const contextValue =
    mode === 'mapping'
      ? {
          mode,
          nodeTypes: mappingNodeTypes,
          edgeTypes: EDGE_TYPES,
          isValidEdge: isValidEdgeBase,
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
          options: REACT_FLOW_OPTIONS,
          bgVariant: BG_VARIANT,
        }
      : mode === 'readonly'
      ? {
          mode,
          nodeTypes: readonlyNodeTypes,
          edgeTypes: EDGE_TYPES,
          isValidEdge: isValidEdgeBase,
          options: REACT_FLOW_OPTIONS,
          bgVariant: BG_VARIANT,
        }
      : {
          mode,
          nodeTypes: editableNodeTypes,
          edgeTypes: EDGE_TYPES,
          isValidEdge: isValidEdgeBase,
          options: REACT_FLOW_OPTIONS,
          bgVariant: BG_VARIANT,
        };

  return <ArchetypeFlowContext.Provider value={contextValue}>{children}</ArchetypeFlowContext.Provider>;
};
