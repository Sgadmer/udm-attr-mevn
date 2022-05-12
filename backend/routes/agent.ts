import { Router } from 'express'
import agentController from '~~/backend/controllers/agent'

const Agent = Router()

Agent.get('/', agentController.findAll)
Agent.get('/:id', agentController.findById)
Agent.post('/', agentController.create)
Agent.put('/', agentController.update)

export default Agent
