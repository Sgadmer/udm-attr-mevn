import { Tourist } from '../../models/tourist'

const findAll = async () => Tourist.find({})

const findById = async (id) => Tourist.findById(id)

const findByParams = async (params) => Tourist.find(params)

export default {
  findAll,
  findById,
  findByParams
}
