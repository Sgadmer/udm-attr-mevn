import getTourService from '~~/backend/services/tour/get'
import postTourService from '~~/backend/services/tour/post'
import putTourService from '~~/backend/services/tour/put'
import { getRealImagePath } from '~~/backend/utlis/helpers'
import _ from 'lodash'
import * as dfns from 'date-fns'
import getAgentService from '~~/backend/services/agent/get'
import getTouristService from '~~/backend/services/tourist/get'

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
      touristId,
      excludeTouristId,
      agentId,
      mainPhoto,
      addPhotos,
      title,
      place,
      dateStart,
      dateEnd,
      priceMin,
      priceMax,
      desc,
      status,
    } = req.query
    
    
    let priceFilter: Record<string, any> | null = {}
    if (priceMin) priceFilter.$gte = +priceMin
    if (priceMax) priceFilter.$lte = +priceMax
    if (!priceMin && !priceMax) priceFilter = null
    
    const placeFilter = place ? {
      $regex: place,
      $options: 'i'
    } : null
    
    const dateStartFilter = dateStart ? { $gte: dfns.startOfDay(new Date(dateStart)) } : null
    const dateEndFilter = dateEnd ? { $lte: dfns.endOfDay(new Date(dateEnd)) } : null
    
    let touristsFilter = null
    if (touristId) touristsFilter = touristId
    else if (excludeTouristId) touristsFilter = { $ne: excludeTouristId }
    
    res.status(200)
      .json((await getTourService.findByParams(_.omitBy({
        agentId,
        mainPhoto,
        addPhotos,
        title,
        price: priceFilter,
        place: placeFilter,
        dateStart: dateStartFilter,
        dateEnd: dateEndFilter,
        desc,
        'tourists.touristId': touristsFilter,
        status,
      }, (v) => _.isUndefined(v) || _.isNull(v) || v === ''))))
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
    
    const agent = await getAgentService.findById(agentId)
    if (!agent.isActive) res.status(500).json('Невозможно создать тур, т.к. аккаунт заблокирован')
    
    
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
    
    const tour = await getTourService.findById(id)
    const agent = await getAgentService.findById(tour.agentId)
    if (!agent.isActive) res.status(500).json('Невозможно обновить тур, т.к. аккаунт заблокирован')
    
    let mainPhotoSrc = null
    let addPhotosSrc = null
    
    if (req.files) {
      mainPhotoSrc = getRealImagePath(req, req.files.mainPhoto[0])
      addPhotosSrc = req.files.addPhotos.map(photoObj => {
        return getRealImagePath(req, photoObj)
      })
    }
    
    const newTour = await putTourService.update(id, _.omitBy({
      mainPhoto: mainPhotoSrc,
      addPhotos: addPhotosSrc,
      title,
      price,
      place,
      dateStart,
      dateEnd,
      desc,
      status,
    }, _.isNil))
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
    
    const tourist = await getTouristService.findById(touristId)
    if (!tourist.isActive) res.status(500).json('Невозможно взаимодействовать с туром, т.к. аккаунт заблокирован')
    
    const updTour = await putTourService.updateTourist(tourId, touristId, status, operation)
    
    res.status(200)
      .json(updTour)
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const updateToursStatus = async (): Promise<void> => {
  try {
    const tours = await getTourService.findByParams({ status: { $in: ['NEW', 'ACTIVE', 'PENDING'] } })
    
    let dateStart = null
    let dateEnd = null
    let dateNow = null
    
    tours.forEach((tour) => {
      dateStart = dfns.getTime(tour.dateStart)
      dateEnd = dfns.getTime(tour.dateEnd)
      dateNow = dfns.getTime(new Date())
      
      switch (tour.status) {
        case 'NEW':
          if (dateNow >= dateStart) tour.status = 'CANCELED'
          break
        case 'ACTIVE':
          if (dateNow >= dateStart) tour.status = 'PENDING'
          break
        case 'PENDING':
          if (dateNow >= dateEnd) tour.status = 'FINISHED'
          break
      }
      
      tour.save()
    })
    
  } catch (e) {
    console.error(e)
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
  findTouristsBooks,
  updateToursStatus
}
