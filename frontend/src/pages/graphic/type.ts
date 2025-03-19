export interface PreparationGraphicStructure {
  mixing: {
    actionId: number | null
    actionName: string | null
    tool: string | null
    time: number | string | null
    pattern: string | null
    speed: number | null
    hideDetails: boolean
  }
  packaging: {
    gridId: number | null
    gridName: string | null
    rows: number | null
    columns: number | null
    hideDetails: boolean
  }
  storaging: {
    containerId: number | null
    containerName: string | null
  }
  editMode: boolean
}
