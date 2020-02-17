let upload = require('./multer')()

exports.setMulter = upload.fields([
    {
        name:'imageCover', maxCount: 1
    }, {
        name: 'images', maxCount: 12
    }
])

exports.uploadSingle = (req, res, next) => {
    if (!req.files.imageCover) return next()
    let file = req.files.imageCover[0]

    req.body.imageCover = file.filename
    next()
}

exports.uploadMultiple = (req, res, next) => {
    if(!req.files.images) return next()
    // console.log(req.files.images)
    req.body.images = []
    let allFiles = req.files.images
    allFiles.forEach(file => {
        req.body.images.push(file.filename)
    })
    next()
}