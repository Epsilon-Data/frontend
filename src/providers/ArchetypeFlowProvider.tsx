import React, { Dispatch, SetStateAction } from 'react';
import { ArchetypeFlowContext, FlowMode } from '@app/context/ArchetypeFlow';
import { BG_VARIANT, REACT_FLOW_OPTIONS } from '@app/constants/reactflow/reactflowOptions';
import { nodeTypes } from '@app/constants/reactflow/nodeTypes';
import { MapEdge } from '@app/components/reactflow-components/MapEdge/MapEdge';
import type { Edge, EdgeTypes, Node } from '@xyflow/react';

const EDGE_TYPES: EdgeTypes = { default: MapEdge };

type Props = React.PropsWithChildren<{
  mode: FlowMode;
}>;

export const ArchetypeFlowProvider: React.FC<Props> = ({ mode, children }) => {
  const contextValue =
    mode === 'mapping'
      ? {
          mode,
          nodeTypes: nodeTypes,
          edgeTypes: EDGE_TYPES,
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
      : {
          mode,
          nodeTypes: nodeTypes,
          edgeTypes: EDGE_TYPES,
          options: REACT_FLOW_OPTIONS,
          bgVariant: BG_VARIANT,
        };

  return <ArchetypeFlowContext.Provider value={contextValue}>{children}</ArchetypeFlowContext.Provider>;
};
