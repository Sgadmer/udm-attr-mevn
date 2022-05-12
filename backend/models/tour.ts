import mongoose from 'mongoose'

const touristBookSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Tourist',
    required: true,
  },
  bookStatus: {
    type: String,
    required: true
  }
})

const tourSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Agent',
    immutable: true,
    required: true
  },
  mainPhoto: {
    type: String,
    required: true,
  },
  addPhotos: {
    type: [String],
    required: false,
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0 && v <= 100000
      },
      message: props => `Мин. цена - 0, макс. цена - 100000`
    },
  },
  place: {
    type: String,
    required: true,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  desc: {
    type: String,
    required: true,
    maxLength: 2000,
  },
  tourists: {
    type: [touristBookSchema],
    required: false,
  },
  status: {
    type: String,
    required: true,
    default: () => 'Blocked'
  },
})

tourSchema.pre('save', function (next) {
  // this.updatedAt = Date.now()
  next()
})

export const Tour = mongoose.model('Tour', tourSchema)
