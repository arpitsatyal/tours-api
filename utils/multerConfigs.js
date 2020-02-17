let upload = require('./multer')()
let sharp = require('sharp')
let fs = require('fs')
let path = require('path')

exports.setMulter = upload.fields([
    {
        name: 'imageCover', maxCount: 1
    }, {
        name: 'images', maxCount: 12
    }
])

exports.deleteFile = file => {
    let p = path.join(process.cwd(), '/uploads/' + file)
    fs.unlink(p, (err, done) => err ? console.log(err) : '')
}

exports.uploadSingle = async (req, res, next) => {
    try {
        if (!req.files.imageCover) return next()

        // ### when uploading using diskstorage ###
        // let file = req.files.imageCover[0]
        // req.body.imageCover = file.filename

        req.body.imageCover = `${Date.now()}-image.png`
        // console.log('filename>>>', req.files.imageCover[0]) => does NOT have filename
        await sharp(req.files.imageCover[0].buffer)
            .resize(400, 400)
            .toFormat('png')
            .png({ quality: 90 })
            .toFile(`uploads/${req.body.imageCover}`)
        next()
    } catch (e) {
        // console.log(req.body.imageCover)
        deleteFile(req.body.imageCover)
        next(e)
    }
}

exports.uploadMultiple = async (req, res, next) => {
    try {
        if (!req.files.images) return next()
        req.body.images = []
        let allFiles = req.files.images

        let processing = allFiles.map(async (file, i) => {
            let imageName = `${Date.now()}-${i + 1}.png`
            await sharp(file.buffer)
                .resize(400, 400).toFormat('png').png({ quality: 90 }).toFile(`uploads/${imageName}`)
                req.body.images.push(imageName)
        })
        // console.log(processing) => no of promises pending in req.files.images
        Promise.all(processing).then(() => next())

    } catch (e) { next(e) }
}


