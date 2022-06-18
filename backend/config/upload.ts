import multer from 'multer'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir('./uploads/',(err)=>{
      cb(null, './uploads/');
    })
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '.png')
  }
})

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}


export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 0.5
  },
  fileFilter: fileFilter,
})
