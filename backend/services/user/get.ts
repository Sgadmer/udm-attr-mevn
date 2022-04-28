import { User } from '../../models/user'

const all = async () => User.find({})

const byId = async (id) => User.findById(id)

export default {
  all,
  byId
}
