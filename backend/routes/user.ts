import { Router } from 'express'
import userController from '~~/backend/controllers/user'

const User = Router()

User.get('/check', userController.isAccountExist)

export default User
