import { Tourist } from '../../models/tourist'

const create = (tourist) => Tourist.create(tourist)

export default {
  create
}
