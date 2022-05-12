import { Router } from 'express'
import touristController from '~~/backend/controllers/tourist'

const Tourist = Router()

Tourist.get('/', touristController.findAll)
Tourist.get('/:id', touristController.findById)
Tourist.post('/', touristController.create)
Tourist.put('/', touristController.update)

export default Tourist
