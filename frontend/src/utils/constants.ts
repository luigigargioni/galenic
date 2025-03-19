import { TablePaginationConfig } from 'antd'

export const drawerWidth = 260
export const defaultOpenItem = ''
export const defaultPath = '/'

export enum USER_GROUP {
  MANAGER = 'Manager',
  OPERATOR = 'Operator',
}

export const defaultPageSizeSelection = 10
export const defaultCurrentPage = 1
const defaultPageSizeOptions = [10, 25, 40]
export const defaultPaginationConfig: TablePaginationConfig = {
  pageSizeOptions: defaultPageSizeOptions,
  showSizeChanger: true,
  hideOnSinglePage: true,
}

export const timerTimeoutAutocomplete = 500
export const minCharsAutocomplete = 1
