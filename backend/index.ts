import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDB } from './config'
import AppRoutes from './routes'

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

AppRoutes.forEach(({ route, router }) => {
  app.use(`/api/${ route }`, router)
})


export default app
