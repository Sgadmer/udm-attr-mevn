import getTourService from '~~/backend/services/tour/get'
import postTourService from '~~/backend/services/tour/post'
import putTourService from '~~/backend/services/tour/put'

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
      .json((await getTourService.findById(req.params.id)))
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
    } = req.body
    
    
    res.status(200)
      .json((await getTourService.findByParams({
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
      })))
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
    
    console.log({body: req.body, files: req.files.mainPhoto})
    
    const newTour = await postTourService.create({
      agentId,
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
      mainPhoto,
      addPhotos,
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
      mainPhoto,
      addPhotos,
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
