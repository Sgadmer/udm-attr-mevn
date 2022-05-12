import { Agent } from '../../models/agent'

const findAll = async () => Agent.find({})

const findById = async (id) => Agent.findById(id)

export default {
  findAll,
  findById
}
