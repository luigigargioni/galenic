import { Edge, Node, Position } from 'reactflow'
import { Theme } from '@mui/material'
import { ContainerType } from 'pages/containers/types'
import { ActionType } from 'pages/actions/types'
import { GridType } from 'pages/grids/types'

export const preparationJsonToFlow = (
  dataContainers: ContainerType[],
  dataGrids: GridType[],
  dataMixings: ActionType[],
  mixingHideDetails: boolean,
  packagingHideDetails: boolean,
  theme: Theme,
  editMode: boolean,
): {
  initialNodes: Node[]
  initialEdges: Edge[]
} => {
  const initialNodes: Node[] = []
  const initialEdges: Edge[] = []

  // GROUPS
  // Mixing group
  const mixingGroup: Node = {
    id: 'mixing-group',
    data: { label: 'Mixing' },
    position: { x: 0, y: 0 },
    // sourcePosition: Position.Bottom,
    // targetPosition: Position.Bottom,
    className: 'no-handles',
    style: {
      backgroundColor: (theme.palette.primary as any).lighter,
      width: 250,
      height: 160,
    },
  }
  initialNodes.push(mixingGroup)

  // Mixing Action Details group
  const mixingActionDetailGroup: Node = {
    id: 'mixing-action-detail-group',
    data: { label: 'Action Details' },
    position: { x: -420, y: -100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
    hidden: mixingHideDetails,
    className: 'circle-group',
    style: {
      backgroundColor: (theme.palette.primary as any).lighter,
      width: 370,
      height: 510,
    },
  }
  initialNodes.push(mixingActionDetailGroup)

  // Packaging group
  const packagingGroup: Node = {
    id: 'packaging-group',
    data: { label: 'Packaging' },
    position: { x: 0, y: 200 },
    // sourcePosition: Position.Bottom,
    // targetPosition: Position.Top,
    className: 'no-handles',
    style: {
      backgroundColor: (theme.palette.warning as any).lighter,
      width: 250,
      height: 150,
    },
  }
  initialNodes.push(packagingGroup)

  // Packaging Grid Details group
  const packagingGridDetailsGroup: Node = {
    id: 'packaging-grid-detail-group',
    data: { label: 'Grid Details' },
    position: { x: 300, y: 200 },
    sourcePosition: Position.Left,
    targetPosition: Position.Left,
    hidden: packagingHideDetails,
    className: 'circle-group',
    style: {
      backgroundColor: (theme.palette.warning as any).lighter,
      width: 300,
      height: 300,
    },
  }
  initialNodes.push(packagingGridDetailsGroup)

  // Storaging group
  const storagingGroup: Node = {
    id: 'storaging-group',
    data: { label: 'Storage' },
    position: { x: 0, y: 400 },
    // targetPosition: Position.Top,
    // sourcePosition: Position.Top,
    className: 'no-handles',
    style: {
      backgroundColor: (theme.palette.info as any).lighter,
      width: 250,
      height: 150,
    },
  }
  initialNodes.push(storagingGroup)

  // NODES
  // Mixing Action node
  const mixingActionNode: Node = {
    id: 'action',
    type: 'ActionNode',
    data: {
      listMixings: dataMixings,
    },
    position: { x: 30, y: 40 },
    parentNode: 'mixing-group',
    className: mixingHideDetails ? 'no-handles' : '',
    selectable: editMode,
  }
  initialNodes.push(mixingActionNode)

  // Mixing Tool node
  const mixingToolNode: Node = {
    id: 'tool',
    type: 'ActionToolNode',
    data: null,
    position: { x: 80, y: 45 },
    hidden: mixingHideDetails,
    parentNode: 'mixing-action-detail-group',
    selectable: editMode,
  }
  initialNodes.push(mixingToolNode)

  // Mixing Time node
  const mixingTimeNode: Node = {
    id: 'time',
    type: 'ActionTimeNode',
    data: null,
    position: { x: 80, y: 150 },
    hidden: mixingHideDetails,
    parentNode: 'mixing-action-detail-group',
    selectable: editMode,
  }
  initialNodes.push(mixingTimeNode)

  // Mixing Speed node
  const mixingSpeedNode: Node = {
    id: 'speed',
    type: 'ActionSpeedNode',
    data: null,
    position: { x: 80, y: 255 },
    hidden: mixingHideDetails,
    parentNode: 'mixing-action-detail-group',
    selectable: editMode,
  }
  initialNodes.push(mixingSpeedNode)

  // Mixing Pattern node
  const mixingPatternNode: Node = {
    id: 'pattern',
    type: 'ActionPatternNode',
    data: null,
    position: { x: 80, y: 360 },
    hidden: mixingHideDetails,
    parentNode: 'mixing-action-detail-group',
    selectable: editMode,
  }
  initialNodes.push(mixingPatternNode)

  // Packaging node
  const packagingGridNode: Node = {
    id: 'grid',
    type: 'GridNode',
    data: {
      listGrids: dataGrids,
    },
    position: { x: 30, y: 40 },
    parentNode: 'packaging-group',
    className: packagingHideDetails ? 'no-handles' : '',
    selectable: editMode,
  }
  initialNodes.push(packagingGridNode)

  // Packaging Grid Rows node
  const packagingGridRowsNode: Node = {
    id: 'grid-rows',
    type: 'GridRowsNode',
    data: null,
    position: { x: 45, y: 45 },
    hidden: packagingHideDetails,
    parentNode: 'packaging-grid-detail-group',
    selectable: editMode,
  }
  initialNodes.push(packagingGridRowsNode)

  // Packaging Grid Columns node
  const packagingGridColumnsNode: Node = {
    id: 'grid-columns',
    type: 'GridColumnsNode',
    data: null,
    position: { x: 45, y: 150 },
    hidden: packagingHideDetails,
    parentNode: 'packaging-grid-detail-group',
    selectable: editMode,
  }
  initialNodes.push(packagingGridColumnsNode)

  // Storaging node
  const storagingContainerNode: Node = {
    id: 'container',
    type: 'ContainerNode',
    data: {
      listContainers: dataContainers,
    },
    position: { x: 30, y: 40 },
    parentNode: 'storaging-group',
    selectable: editMode,
  }
  initialNodes.push(storagingContainerNode)

  // EDGES
  // Mixing to Packaging edge
  /*   const mixingPackagingEdge: Edge = {
    id: 'mixing-packaging',
    source: 'mixing-group',
    sourceHandle: 'mixing-to-packaging',
    target: 'packaging-group',
  }
  initialEdges.push(mixingPackagingEdge) */

  // Packaging to Storaging edge
  /*   const packagingStoragingEdge: Edge = {
    id: 'packaging-storaging',
    source: 'packaging-group',
    sourceHandle: 'packaging-to-storaging',
    target: 'storaging-group',
  }
  initialEdges.push(packagingStoragingEdge) */

  // Packaging to PackagingGridDetails edge
  const packagingGridDetailsEdge: Edge = {
    id: 'packaging-grid-details',
    source: 'grid',
    sourceHandle: 'packaging-to-packaging-grid-details',
    target: 'packaging-grid-detail-group',
    hidden: packagingHideDetails,
    zIndex: 1,
  }
  initialEdges.push(packagingGridDetailsEdge)

  // Mixing to MixingActionDetails edge
  const mixingActionDetailsEdge: Edge = {
    id: 'mixing-action-details',
    source: 'action',
    sourceHandle: 'mixing-to-mixing-action-details',
    target: 'mixing-action-detail-group',
    hidden: mixingHideDetails,
    zIndex: 1,
  }
  initialEdges.push(mixingActionDetailsEdge)

  return {
    initialNodes,
    initialEdges,
  }
}

export const styleAutocomplete = {
  '.MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: '10.5px 14px 10.5px 12px',
  },
  '.MuiOutlinedInput-root': {
    padding: 0,
  },
  '.MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
    top: 'unset',
  },
}
