import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDB } from './config'
import AppRoutes from './routes'

connectDB()

const app = express()
// enable cors to the server
const corsOpt = {
  origin: process.env.CORS_ALLOW_ORIGIN || '*', // this work well to configure origin url in the server
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // to works well with web app, OPTIONS is required
  allowedHeaders: ['Content-Type', 'Authorization'] // allow json and token in the headers
};
app.use(cors(corsOpt)); // cors for all the routes of the application
app.options('*', cors(corsOpt)); // automatic cors gen for HTTP verbs in all routes, This can be redundant but I kept to be sure that will always work.


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


AppRoutes.forEach(({ route, router }) => {
  app.use(`/api/${ route }`, router)
})


export default app
