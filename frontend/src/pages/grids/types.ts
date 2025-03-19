export interface GridType {
  id: number
  name: string
  shared: boolean
  height: number | null
  owner: number
  keywords: string[]
  robot: number | null
  photo: string
  contour: string
  shape: string
  rows: number
  columns: number
}

export type GridDetailType = Omit<GridType, 'owner'>
