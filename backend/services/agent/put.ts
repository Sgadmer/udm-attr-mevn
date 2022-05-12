import { Agent } from '../../models/agent'

const update = (id, agent) => Agent.findByIdAndUpdate(id, agent, {new: true})

export default {
  update
}
