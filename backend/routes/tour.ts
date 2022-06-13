import { Router } from 'express'
import tourController from '~~/backend/controllers/tour'
import { upload } from '../config/upload'

const cpUpload = upload.fields([{ name: 'mainPhoto', maxCount: 1 }, { name: 'addPhotos', maxCount: 10 }])

const Tour = Router()

Tour.get('/', tourController.findAll)
Tour.get('/id', tourController.findById)
Tour.get('/params', tourController.findByParams)
Tour.get('/books', tourController.findTouristsBooks)
Tour.post('/', cpUpload, tourController.create)
Tour.put('/', cpUpload, tourController.update)
Tour.put('/tourist', tourController.updateTourist)

export default Tour
