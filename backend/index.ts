import express from 'express'
import cors from 'cors'
import { connectDB } from './config'
import AppRoutes from './routes'
import tourController from '~~/backend/controllers/tour'
import * as dfns from 'date-fns'

connectDB()

const app = express()
app.use(cors({ credentials: true, origin: true }))
app.options('*', cors({ credentials: true, origin: true }))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

AppRoutes.forEach(({ route, router }) => {
  app.use(`/api/${ route }`, router)
})

const updateBDHandler = () => {
  
  const nextMidnight = new Date().setHours(24, 0, 0, 0)
  const millisecondsToNextMidnight = dfns.differenceInMilliseconds(
    nextMidnight,
    new Date()
  )
  
  setTimeout((): void => {
    const upd = tourController.updateToursStatus()
    updateBDHandler()
  }, millisecondsToNextMidnight)
}
updateBDHandler()

export default app
