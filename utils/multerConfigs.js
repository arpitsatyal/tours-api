let upload = require('./multer')()
let sharp = require('sharp')
let fs = require('fs')
let path = require('path')
let cloudinary = require('cloudinary').v2

exports.setMulter = upload.fields([
    {
        name: 'imageCover', maxCount: 1
    },
    {
        name: 'profilePic', maxCount: 1
    },
    {
        name: 'images', maxCount: 12
    }
])

exports.deleteFile = (file, dest) => {
    let p = path.join(process.cwd(), `/uploads/${dest}/` + file)
    fs.unlink(p, (err, done) => err ? console.log(err) : '')
}

async function resize(file, path, body) {
    await sharp(file)
        .resize(400, 400)
        .toFormat('png')
        .png({ quality: 90 })
        .toFile(`uploads/${path}/${body}`)
}

cloudinary.config({
    cloud_name: 'arpit7xx',
    api_key: '797233148615947',
    api_secret: 'lsXgwHBZbYvwOaZZssmrBCrKh0o',
    secure: true
})

exports.uploadSingle = (req, res, next) => {
    try {
        // if(!req.files) return next()
        //  console.log('req ko files', req.files)
        // if (req.files.images) {
            // req.body.imageCover = `${Date.now()}-image.png`
                // Tour.updateOne()
            // resize(req.files.imageCover[0].buffer, 'tours', req.body.images)
        // }

        // if (req.files.profilePic) {
        //     req.body.profilePic = `${Date.now()}-user.png`
        //     resize(req.files.profilePic[0].buffer, 'users', req.body.profilePic)
        //     resize(req.files.profilePic[0].buffer, 'tours', req.body.profilePic)
        //     cloudinary.v2.uploader.upload(req.files.profilePic[0], {
        //         resource_type: "image", chunk_size: 6000000
        //     })
        //     .then(response => {
        //         console.log('uploaded in cloud response', response)
        //     })
        // }

        next()
    } catch (e) { next(e) }
}

exports.uploadMultiple = (req, res, next) => {
    try {
        if(!req.files) return next()
        if (!req.files.images) return next()
        req.body.images = []
        let allFiles = req.files.images

         allFiles.forEach((file, i) => {
         let imageName = `${Date.now()}-${i + 1}.png`
         req.body.images.push(imageName)
         resize(file.buffer, 'tours', imageName)
        })
        next()

    } catch (e) { next(e) }
}


