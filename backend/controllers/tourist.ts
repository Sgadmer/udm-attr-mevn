import getTouristService from '~~/backend/services/tourist/get'
import postTouristService from '~~/backend/services/tourist/post'
import putTouristService from '~~/backend/services/tourist/put'
import getUserService from '~~/backend/services/user/get'
import _ from 'lodash'


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

export const findByParams = async (req, res) => {
  
  const {
    surname,
    name,
    patronymic,
    phone,
    email,
    isBlocked,
  } = req.query
  
  const params: Record<string, any> = _.omitBy({
      surname,
      name,
      patronymic,
      phone,
      email,
    },
    (v) => _.isUndefined(v) || _.isNull(v) || v === ''
  )
  
  Object.entries(params).forEach(([key, value]): void => {
    params[key] = {
      $regex: value,
      $options: 'i'
    }
  })
  
  params.isActive = !JSON.parse(isBlocked)
  
  try {
    res.status(200)
      .json((await getTouristService.findByParams(params)))
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
      isActive
    } = req.body
    
    if (!id) res.status(500).json('Не указан id')
    
    const updTourist = await putTouristService.update(id, _.omitBy({
      email,
      password,
      corpName,
      inn,
      director,
      phone,
      corpAddress,
      isActive
    }, _.isNil))
    res.status(200)
      .json(updTourist)
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
  update
}
