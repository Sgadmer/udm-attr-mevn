import { Tour } from '../../models/tour'

const findAll = async () => Tour.find({}).populate(['agentId', 'tourists.touristId']).sort({ dateStart: -1 })

const findById = async (id) => Tour.findById(id).populate(['agentId', 'tourists.touristId'])

const findByParams = async (params) => (
  Tour
    .find(params)
    .sort({ dateStart: -1 })
    .populate(['agentId', 'tourists.touristId'])
)

const findTouristsBooks = async (touristId) => Tour.find({ 'tourists.touristId': touristId }, {
  mainPhoto: 1,
  addPhotos: 1,
  title: 1,
  price: 1,
  place: 1,
  dateStart: 1,
  dateEnd: 1,
  desc: 1,
  status: 1
})

export default {
  findAll,
  findById,
  findByParams,
  findTouristsBooks
}
