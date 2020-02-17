let upload = require('./multer')()
let sharp = require('sharp')

exports.setMulter = upload.fields([
    {
        name:'imageCover', maxCount: 1
    }, {
        name: 'images', maxCount: 12
    }
])

exports.uploadSingle = async (req, res, next) => {
    if (!req.files.imageCover) return next()

    // ### when uploading using diskstorage ###
    // let file = req.files.imageCover[0]
    // req.body.imageCover = file.filename

    req.body.imageCover = `${Date.now()}-image.png`
    await sharp(req.files.imageCover[0].buffer)
        .resize(400,400)
        .toFormat('png')
        .png({ quality: 90 })
        .toFile(`uploads/${req.body.imageCover}`)
        next()
}


exports.uploadMultiple = async(req, res, next) => {

    if(!req.files.images) return next()
    req.body.images = []
    let allFiles = req.files.images
   let processing = allFiles.map(async(file, i) => {
       let imageName = `${Date.now()}-${i + 1}.jpeg`
        await sharp(file.buffer)
        .resize(400,400).toFormat('png').toFile(`uploads/${imageName}`)
        req.body.images.push(imageName)
    })
    Promise.all(processing)
    .then(() => next())
}