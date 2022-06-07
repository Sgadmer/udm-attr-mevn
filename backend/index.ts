import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDB } from './config'
import AppRoutes from './routes'

connectDB()

const app = express()
// app.use(cors({credentials: true, origin: true}))
// app.options('*', cors({credentials: true, origin: true}))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

AppRoutes.forEach(({ route, router }) => {
  app.use(`/api/${ route }`, router)
})


export default app
