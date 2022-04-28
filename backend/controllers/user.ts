import getUserService from '../services/user/get'
import postUserService from '../services/user/post'
import putUserService from '../services/user/put'
import deleteUserService from '../services/user/delete'

export const fetchUsers = async (req, res) => {
  try {
    res.status(200)
      .json((await getUserService.all()))
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const fetchUser = async (req, res) => {
  try {
    res.status(200)
      .json((await getUserService.byId(req.params.id)))
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age
    } = req.body
    
    const newUser = await postUserService.create({
      name,
      email,
      password,
      age
    })
    res.status(200)
      .json(newUser)
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age
    } = req.body
    
    const userUpdatedById = await putUserService.byId(req.params.id, {
      name,
      email,
      password,
      age
    })
    
    res.status(200)
      .json(userUpdatedById)
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export const deleteUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body
  
    const deletedUser = await deleteUserService.byId(req.params.id)
    res.status(200)
      .json(deletedUser)
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export default {
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
}
