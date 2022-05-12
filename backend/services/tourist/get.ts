import { Tourist } from '../../models/tourist'

const findAll = async () => Tourist.find({})

const findById = async (id) => Tourist.findById(id)

export default {
  findAll,
  findById
}
