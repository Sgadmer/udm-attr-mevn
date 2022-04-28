import { Router } from 'express'
import userController from '../controllers/user'

const User = Router()

User.get('/', userController.fetchUsers)

User.get('/:id', userController.fetchUser)

User.post('/', userController.createUser)

User.put('/:id', userController.updateUser)

User.delete('/:id', userController.deleteUser)

export default User
