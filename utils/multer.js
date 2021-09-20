module.exports = () => {
    let multer = require('multer')

    // configure destination and filename
    let myStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/')
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })

    let multerStorage = multer.memoryStorage()

    //filter out files that aint images
    filter = (req, file, cb) => {
        let mimeType = file.mimetype.split('/')[0]
        if (mimeType !== 'image') {
            req.fileError = true
            cb(null, false)
        } else {
            cb(null, true)
        }
    }

    let upload = multer({
        storage: multerStorage,
        fileFilter: filter
    })
    return upload
}