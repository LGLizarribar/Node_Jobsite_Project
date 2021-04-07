const multer = require('multer');
const path = require('path');

const VALID_TYPE_FILES = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
});

const fileFilter = (req, file, cb) => {
    if(VALID_TYPE_FILES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Invalidad file type!');
        cb(error);
    }
}

const upload = multer({
    storage,
    fileFilter,
});

module.exports = { upload };