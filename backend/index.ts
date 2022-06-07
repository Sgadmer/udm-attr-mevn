import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDB } from './config'
import AppRoutes from './routes'

connectDB()

const app = express()
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


AppRoutes.forEach(({ route, router }) => {
  app.use(`/api/${ route }`, router)
})


export default app
