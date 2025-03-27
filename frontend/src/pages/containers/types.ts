export type PositionType = {
  X: number
  Y: number
  Z: number
  RX: number
  RY: number
  RZ: number
  FIG: number
}

export interface ContainerType {
  id: number
  name: string
  shared: boolean
  owner: number
  owner__username: string
}

export type ContainerDetailType = {
  id: number
  name: string
  shared: boolean
  position: PositionType | null
  photo: string
  contour: string
  shape: string
  keywords: string[]
}
