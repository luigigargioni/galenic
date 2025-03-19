import {
  SubnodeOutlined,
  AppstoreOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import { MenuItem } from './types'

export const libraries: MenuItem = {
  id: 'libraries',
  title: 'Libraries',
  type: 'group',
  children: [
    {
      id: 'actions',
      title: 'Actions',
      type: 'item',
      url: '/actions',
      icon: SubnodeOutlined,
    },
    {
      id: 'grids',
      title: 'Grids',
      type: 'item',
      url: '/grids',
      icon: AppstoreOutlined,
    },
    {
      id: 'containers',
      title: 'Containers',
      type: 'item',
      url: '/containers',
      icon: ExperimentOutlined,
    },
  ],
}
