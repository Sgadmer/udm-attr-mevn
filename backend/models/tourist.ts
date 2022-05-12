import mongoose from 'mongoose'

const touristSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  patronymic: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    required: false,
    default: () => true
  },
})

touristSchema.pre('save', function (next) {
  // this.updatedAt = Date.now()
  next()
})

export const Tourist = mongoose.model('Tourist', touristSchema)
