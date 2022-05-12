import mongoose from 'mongoose'

const agentSchema = new mongoose.Schema({
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
  corpName: {
    type: String,
    required: true
  },
  inn: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return v.length === 10 || v.length === 12
      },
      message: props => `Инн должен содержать 10 или 12 символов`
    },
  },
  director: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  corpAddress: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    required: false,
    default: () => true
  },
})

agentSchema.pre('save', function (next) {
  // this.updatedAt = Date.now()
  next()
})

export const Agent = mongoose.model('Agent', agentSchema)
