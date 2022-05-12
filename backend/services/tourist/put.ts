import { Tourist } from '../../models/tourist'

const update = (id, tourist) => Tourist.findByIdAndUpdate(id, tourist, {new: true})

export default {
  update
}
