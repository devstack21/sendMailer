import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/'); // Specify the directory to store uploaded files
  },
  filename: function (req, file, cb) {
  
    const originalFilename = file.originalname;
    cb(null, originalFilename);
  },
});

export const upload = multer({
  storage: storage,
  
})