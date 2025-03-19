import React, { useEffect, useMemo } from 'react'
import ReactFlow, {
  Controls,
  Edge,
  Node,
  NodeTypes,
  ProOptions,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material'
import { RootState } from 'store/reducers'

import 'reactflow/dist/style.css'
import './customStyle.css'

import { ContainerType } from 'pages/containers/types'
import { GridType } from 'pages/grids/types'
import { ActionType } from 'pages/actions/types'
import { PreparationGraphicStructure } from '../type'
import { preparationJsonToFlow } from './FlowUtils'
import { ContainerNode } from './customNodes/storaging/containerNode'
import { GridNode } from './customNodes/packaging/gridNode'
import { ActionNode } from './customNodes/mixing/actionNode'
import { GridRowsNode } from './customNodes/packaging/gridRowsNode'
import { GridColumnsNode } from './customNodes/packaging/gridColumnsNodes'
import { ActionToolNode } from './customNodes/mixing/actionToolNode'
import { ActionPatternNode } from './customNodes/mixing/actionPatternNode'
import { ActionSpeedNode } from './customNodes/mixing/actionSpeedNode'
import { ActionTimeNode } from './customNodes/mixing/actionTimeNode'

interface FlowApproachProps {
  dataContainers: ContainerType[]
  dataGrids: GridType[]
  dataActions: ActionType[]
}

const nodeTypes: NodeTypes = {
  ContainerNode,
  GridNode,
  GridRowsNode,
  GridColumnsNode,
  ActionNode,
  ActionToolNode,
  ActionPatternNode,
  ActionSpeedNode,
  ActionTimeNode,
}
const proOptions: ProOptions = { hideAttribution: true }

const FlowApproach = ({
  dataContainers,
  dataGrids,
  dataActions,
}: FlowApproachProps) => {
  const preparationStructure: PreparationGraphicStructure = useSelector(
    (state: RootState) => state.preparation,
  )
  const [nodes, setNodes] = useNodesState<Node[]>([])
  const [edges, setEdges] = useEdgesState<Edge[]>([])
  const theme = useTheme()

  const { initialNodes, initialEdges } = useMemo(() => {
    if (preparationStructure) {
      return preparationJsonToFlow(
        dataContainers,
        dataGrids,
        dataActions,
        preparationStructure.mixing.hideDetails,
        preparationStructure.packaging.hideDetails,
        theme,
        preparationStructure.editMode,
      )
    }
    return { initialNodes: [], initialEdges: [] }
  }, [preparationStructure])

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={false}
        zoomOnDoubleClick={false}
        zoomOnScroll
        fitView
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

export const ReactFlowWrapper = (props: FlowApproachProps) => {
  return (
    <ReactFlowProvider>
      <FlowApproach {...props} />
    </ReactFlowProvider>
  )
}
