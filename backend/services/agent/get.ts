import { Agent } from '../../models/agent'

const findAll = async () => Agent.find({})

const findById = async (id) => Agent.findById(id)

const findByParams = async (params) => Agent.find(params)

export default {
  findAll,
  findById,
  findByParams
}
