import getTourService from '~~/backend/services/tour/get'
import postTourService from '~~/backend/services/tour/post'
import putTourService from '~~/backend/services/tour/put'
import { getRealImagePath } from '~~/backend/utlis/helpers'
import _ from 'lodash'

export const findAll = async (req, res) => {
  try {
    res.status(200)
      .json(await getTourService.findAll())
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const findById = async (req, res) => {
  try {
    console.log('findById!')
    res.status(200)
      .json((await getTourService.findById(req.query.id)))
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const findByParams = async (req, res) => {
  try {
    const {
      agentId,
      mainPhoto,
      addPhotos,
      title,
      price,
      place,
      dateStart,
      dateEnd,
      desc,
      tourists,
      status,
    } = req.query
    
    res.status(200)
      .json((await getTourService.findByParams(_.omitBy({
        agentId,
        mainPhoto,
        addPhotos,
        title,
        price,
        place,
        dateStart,
        dateEnd,
        desc,
        tourists,
        status,
      }, _.isNil))))
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const create = async (req, res) => {
  try {
    const {
      agentId,
      title,
      price,
      place,
      dateStart,
      dateEnd,
      desc,
    } = req.body
    
    const mainPhotoSrc = getRealImagePath(req, req.files.mainPhoto[0])
    const addPhotosSrc = req.files.addPhotos.map(photoObj => {
      return getRealImagePath(req, photoObj)
    })
    
    const newTour = await postTourService.create({
      agentId,
      mainPhoto: mainPhotoSrc,
      addPhotos: addPhotosSrc,
      title,
      price,
      place,
      dateStart,
      dateEnd,
      desc,
    })
    res.status(200)
      .json(newTour)
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const update = async (req, res) => {
  try {
    const {
      id,
      title,
      price,
      place,
      dateStart,
      dateEnd,
      desc,
      status
    } = req.body
    
    if (!id) res.status(500).json('Не указан id')
    
    const newTour = await putTourService.update(id, {
      title,
      price,
      place,
      dateStart,
      dateEnd,
      desc,
      status
    })
    res.status(200)
      .json(newTour)
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const updateTourist = async (req, res) => {
  try {
    const {
      tourId,
      touristId,
      status,
      operation
    } = req.body
    
    const updTour = await putTourService.updateTourist(tourId, touristId, status, operation)
    
    res.status(200)
      .json(updTour)
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const findTouristsBooks = async (req, res) => {
  try {
    const touristBooks = await getTourService.findTouristsBooks(req.params.id)
    
    res.status(200)
      .json(touristBooks)
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}


export default {
  findAll,
  findById,
  findByParams,
  create,
  update,
  updateTourist,
  findTouristsBooks
}
