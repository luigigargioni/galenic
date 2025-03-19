import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { Loadable } from 'components/Loadable'
import { MainLayout } from 'layout/MainLayout'
import { defaultPath } from 'utils/constants'
import { ProtectedRoute } from './ProtectedRoute'

const ListPreparations = Loadable(
  lazy(() => import('pages/preparations/listPreparations')),
)
const DetailPreparation = Loadable(
  lazy(() => import('pages/preparations/detailPreparation')),
)
const ListGrids = Loadable(lazy(() => import('pages/grids/listGrids')))
const DetailGrid = Loadable(lazy(() => import('pages/grids/detailGrid')))
const ListContainers = Loadable(
  lazy(() => import('pages/containers/listContainers')),
)
const DetailContainer = Loadable(
  lazy(() => import('pages/containers/detailContainer')),
)
const ListActions = Loadable(lazy(() => import('pages/actions/listActions')))
const DetailAction = Loadable(lazy(() => import('pages/actions/detailAction')))
const ListMyRobots = Loadable(lazy(() => import('pages/myrobots/listMyRobots')))
const DetailMyRobot = Loadable(
  lazy(() => import('pages/myrobots/detailMyRobot')),
)
const Chat = Loadable(lazy(() => import('pages/chat')))
const Graphic = Loadable(lazy(() => import('pages/graphic')))
const Homepage = Loadable(lazy(() => import('pages/homepage')))
const Faq = Loadable(lazy(() => import('pages/faq')))

export const MainRoutes: RouteObject = {
  path: defaultPath,
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: defaultPath,
      element: (
        <ProtectedRoute>
          <Homepage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'faq',
      element: (
        <ProtectedRoute>
          <Faq />
        </ProtectedRoute>
      ),
    },
    {
      path: 'preparations',
      element: (
        <ProtectedRoute>
          <ListPreparations />
        </ProtectedRoute>
      ),
    },
    {
      path: 'preparation/:id',
      element: (
        <ProtectedRoute>
          <DetailPreparation />
        </ProtectedRoute>
      ),
    },
    {
      path: 'grids',
      element: (
        <ProtectedRoute>
          <ListGrids />
        </ProtectedRoute>
      ),
    },
    {
      path: 'grid/:id',
      element: (
        <ProtectedRoute>
          <DetailGrid />
        </ProtectedRoute>
      ),
    },
    {
      path: 'containers',
      element: (
        <ProtectedRoute>
          <ListContainers />
        </ProtectedRoute>
      ),
    },
    {
      path: 'container/:id',
      element: (
        <ProtectedRoute>
          <DetailContainer />
        </ProtectedRoute>
      ),
    },
    {
      path: 'actions',
      element: (
        <ProtectedRoute>
          <ListActions />
        </ProtectedRoute>
      ),
    },
    {
      path: 'action/:id',
      element: (
        <ProtectedRoute>
          <DetailAction />
        </ProtectedRoute>
      ),
    },
    {
      path: 'myrobots',
      element: (
        <ProtectedRoute>
          <ListMyRobots />
        </ProtectedRoute>
      ),
    },
    {
      path: 'myrobot/:id',
      element: (
        <ProtectedRoute>
          <DetailMyRobot />
        </ProtectedRoute>
      ),
    },
    {
      path: 'chat/:id',
      element: (
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      ),
    },
    {
      path: 'graphic/:id',
      element: (
        <ProtectedRoute>
          <Graphic />
        </ProtectedRoute>
      ),
    },
  ],
}
