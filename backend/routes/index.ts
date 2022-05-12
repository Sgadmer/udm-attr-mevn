import Tourist from './tourist'
import Agent from './agent'
import Tour from './tour'
import User from './user'

const AppRoutes = [
  { route: 'tourist', router: Tourist },
  { route: 'agent', router: Agent },
  { route: 'tour', router: Tour },
  { route: 'user', router: User },
]

export default AppRoutes
