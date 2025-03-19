const PROTOCOL = import.meta.env.VITE_BACKEND_PROTOCOL || 'http://'
const HOST = import.meta.env.VITE_BACKEND_HOST || 'localhost'
const PORT = import.meta.env.VITE_BACKEND_PORT || ':8000'
const API = '/api'

const SERVER = PROTOCOL + HOST + PORT
const SERVER_API = SERVER + API

const AUTH_API = `${SERVER_API}/auth`
const HOME_API = `${SERVER_API}/home`
const GRAPHIC_API = `${SERVER_API}/graphic`
const CHAT_API = `${SERVER_API}/chat`

export const endpoints = {
  auth: {
    login: `${AUTH_API}/login/`,
    logout: `${AUTH_API}/logout/`,
    verifyToken: `${AUTH_API}/verifyToken/`,
  },
  home: {
    user: {
      changePassword: `${HOME_API}/changePassword/`,
    },
    libraries: {
      preparations: `${HOME_API}/preparations/`,
      preparation: `${HOME_API}/preparation/`,
      grids: `${HOME_API}/grids/`,
      grid: `${HOME_API}/grid/`,
      containers: `${HOME_API}/containers/`,
      container: `${HOME_API}/container/`,
      actions: `${HOME_API}/actions/`,
      action: `${HOME_API}/action/`,
      myRobots: `${HOME_API}/myRobots/`,
      myRobot: `${HOME_API}/myRobot/`,
      getPosition: `${HOME_API}/getPosition/`,
      getPhoto: `${HOME_API}/getPhoto/`,
      pingIp: `${HOME_API}/pingIp/`,
    },
    management: {
      users: `${HOME_API}/users/`,
      user: `${HOME_API}/user/`,
      resetPassword: `${HOME_API}/resetPassword/`,
      robots: `${HOME_API}/robots/`,
      robot: `${HOME_API}/robot/`,
      groups: `${HOME_API}/groups/`,
    },
  },
  graphic: {
    saveGraphicPreparation: `${GRAPHIC_API}/saveGraphicPreparation/`,
    getGraphicPreparation: `${GRAPHIC_API}/getGraphicPreparation/`,
  },
  chat: {
    newMessage: `${CHAT_API}/newMessage/`,
    saveChatPreparation: `${CHAT_API}/saveChatPreparation/`,
  },
}
