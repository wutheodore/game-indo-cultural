import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import RegisterPage from './routes/RegisterPage'
import PlayPage from './routes/PlayPage'
import ResultPage from './routes/ResultPage'
import LeaderboardPage from './routes/LeaderboardPage'
import AdminPage from './routes/AdminPage'
import PrizePage from './routes/PrizePage'

const rootRoute = createRootRoute({ component: () => <Outlet /> })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RegisterPage,
})

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play/$sessionId',
  component: PlayPage,
})

const prizeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prize/$sessionId',
  component: PrizePage,
})

const resultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/$sessionId',
  component: ResultPage,
})

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute, playRoute, prizeRoute, resultRoute, leaderboardRoute, adminRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}