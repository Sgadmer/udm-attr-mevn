import { User } from '../../models/user'

const byId = (id, user) => User.findByIdAndUpdate(id, user)

export default {
  byId
}
