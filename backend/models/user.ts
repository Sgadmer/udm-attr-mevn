import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    minLength: 10,
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 1,
    max: 100,
    required: true
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },
  updatedAt: {
    type: Date,
    default: () => Date.now()
  }
})

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

export const User = mongoose.model('User', userSchema)
