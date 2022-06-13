import getAgentService from '~~/backend/services/agent/get'
import postAgentService from '~~/backend/services/agent/post'
import putAgentService from '~~/backend/services/agent/put'
import getUserService from '~~/backend/services/user/get'
import _ from 'lodash'


export const findAll = async (req, res) => {
  try {
    res.status(200)
      .json((await getAgentService.findAll()))
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const findById = async (req, res) => {
  try {
    res.status(200)
      .json((await getAgentService.findById(req.params.id)))
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const findByParams = async (req, res) => {
  
  const {
    corpName,
    phone,
    email,
    isBlocked,
  } = req.query
  
  const params: Record<string, any> = _.omitBy({
      corpName,
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
      .json((await getAgentService.findByParams(params)))
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
      corpName,
      inn,
      director,
      phone,
      corpAddress
    } = req.body
    
    const account = await getUserService.findByParams({ email, phone })
    
    if (account.isExist) {
      res.status(500)
        .json('Аккаунт уже существует')
    } else {
      const newAgent = await postAgentService.create({
        email,
        password,
        corpName,
        inn,
        director,
        phone,
        corpAddress
      })
      res.status(200)
        .json(newAgent)
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
    
    const newTour = await putAgentService.update(id, _.omitBy({
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
      .json(newTour)
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
