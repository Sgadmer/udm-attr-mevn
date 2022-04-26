import express, { Router } from 'express'
import cors from 'cors'
import User from './routes/user'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api', User)

export default app
