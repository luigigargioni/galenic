export interface ActionType {
  id: number
  name: string
  points: string
  shared: boolean
  owner: number
  owner__username: string
  speed: number
  time: number
  pattern: string
  height: number
  tool: string
  keywords: string[]
}

export type ActionDetailType = Omit<ActionType, 'owner' | 'owner__username'>
