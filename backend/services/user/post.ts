import { User } from '../../models/user'

const create = (user) => User.create(user)

export default {
  create
}
