import { Tour } from '../../models/tour'

const update = (id, tour) => Tour.findByIdAndUpdate(id, tour, { new: true })

const updateTourist = (tourId, touristId, status, operation) => Tour.findById(tourId).then(tour => {
  
  
  if (operation === 'change') {
    tour.tourists.forEach(tourist => {
      if (tourist.touristId.toString() === touristId) {
        tourist.bookStatus = status
      }
    })
  }
  
  if (operation === 'add') {
    tour.tourists.push({
      touristId: touristId,
      bookStatus: status
    })
  }
  
  tour.save()
  return tour
})

export default {
  update,
  updateTourist
}
