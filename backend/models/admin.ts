import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
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

adminSchema.pre('save', function (next) {
  // this.updatedAt = Date.now()
  next()
})

export const Admin = mongoose.model('Admin', adminSchema)

// Admin.create({
//   email:"r.smim@yandex.ru",
//   password: "ruslan17$.",
//   phone: "89090624777",
//   name: "Ruslan",
//   surname: "Khaziev",
//   patronymic: "Nailevich"
// })
