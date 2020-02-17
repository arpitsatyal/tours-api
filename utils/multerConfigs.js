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
    let mimeType = file.mimetype.split('/')[0]
    if (mimeType !== 'image') {
        fs.unlink(path.join(process.cwd(), 'uploads/'), (err, done) => {
            if (err) console.log(err)
        })
    }
    req.body.imageCover = file.filename
    next()
}

exports.uploadMultiple = (req, res, next) => {
    if(!req.files.images) return next()
    // console.log(req.files.images)
    req.body.images = []
    let allFiles = req.files.images
    allFiles.forEach(file => {
        let mimeType = file.mimetype.split('/')[0]
        if (mimeType !== 'image') {
            fs.unlink(path.join(process.cwd(), 'uploads/'), (err, done) => {
                if (err) console.log(err)
            })
        }
        req.body.images.push(file.filename)
    })
    next()
}