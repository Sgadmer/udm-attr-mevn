import { Admin } from '../../models/admin'

const findById = async (id) => Admin.findById(id)

export default {
  findById
}
