import { Router } from 'express'
import tourController, { findTouristsBooks } from '~~/backend/controllers/tour'

const Tour = Router()

Tour.get('/', tourController.findAll)
Tour.get('/:id', tourController.findById)
Tour.get('/params', tourController.findByParams)
Tour.get('/books/:id', tourController.findTouristsBooks)
Tour.post('/', tourController.create)
Tour.put('/', tourController.update)
Tour.put('/tourist', tourController.updateTourist)

export default Tour
