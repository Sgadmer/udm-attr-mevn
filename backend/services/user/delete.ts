import { User } from '../../models/user'

const byId = (id) => User.findByIdAndDelete(id)

export default {
  byId
}
