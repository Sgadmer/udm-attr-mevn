import getTouristService from '~~/backend/services/tourist/get'
import postTouristService from '~~/backend/services/tourist/post'
import putTouristService from '~~/backend/services/tourist/put'
import getUserService from '~~/backend/services/user/get'


export const findAll = async (req, res) => {
  try {
    res.status(200)
      .json((await getTouristService.findAll()))
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const findById = async (req, res) => {
  try {
    res.status(200)
      .json((await getTouristService.findById(req.params.id)))
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const create = async (req, res) => {
  try {
    const {
      email,
      password,
      phone,
      name,
      surname,
      patronymic,
    } = req.body
    
    
    const account = await getUserService.findByParams({ email, phone })
    

    if (account.isExist) {
      res.status(500)
        .json('Аккаунт уже существует')
    } else {
      const newTourist = await postTouristService.create({
        email,
        password,
        phone,
        name,
        surname,
        patronymic,
      })
      res.status(200)
        .json(newTourist)
    }
    
    
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const update = async (req, res) => {
  try {
    const {
      id,
      email,
      password,
      corpName,
      inn,
      director,
      phone,
      corpAddress,
      asActive
    } = req.body
    
    if (!id) res.status(500).json('Не указан id')
    
    const updTour = await putTouristService.update(id, {
      email,
      password,
      corpName,
      inn,
      director,
      phone,
      corpAddress,
      asActive
    })
    res.status(200)
      .json(updTour)
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export default {
  findAll,
  findById,
  create,
  update
}
