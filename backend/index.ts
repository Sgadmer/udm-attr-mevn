import express, { Router } from 'express'
import cors from 'cors'
import { connectDB } from './config'
import User from './routes/user'

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/users', User)

export default app
