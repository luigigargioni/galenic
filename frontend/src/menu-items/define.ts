import { ApartmentOutlined } from '@ant-design/icons'
import { MenuItem } from 'menu-items/types'

export const define: MenuItem = {
  id: 'define',
  title: 'Define',
  type: 'group',
  children: [
    {
      id: 'preparations',
      title: 'Preparations',
      type: 'item',
      url: '/preparations',
      icon: ApartmentOutlined,
    },
    /*     {
      id: 'definechat',
      title: 'Chat',
      type: 'item',
      url: '/preparation/add?type=chat',
      icon: CommentOutlined,
    },
    {
      id: 'definegraphic',
      title: 'Graphic',
      type: 'item',
      url: '/preparation/add?type=graphic',
      icon: BranchesOutlined,
    }, */
  ],
}
