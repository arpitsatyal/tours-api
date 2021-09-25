// let catchAsync = require('../utils/catchAsync')
// let cloudinary = require('cloudinary')
// let Tour = require('../models/tourModel')

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET
// })
// uploadImage = catchAsync(async (req, res, next) => {
//     console.log('req files2', req.body, req.file, req.files)
//     // cloudinary.v2.uploader.upload_large(req.body.img, {
//     //     resource_type: "image", chunk_size: 6000000
//     // })

//     //     .then(async res => {
//     //         await Tour.updateOne({
//     //             _id: req.user._id
//     //         }, {
//     //             $push: {
//     //                 images: {
//     //                     imgId: res.public_id,
//     //                     imgVersion: res.version
//     //                 }
//     //             }
//     //         })
//     //     })
//     //     .then(() => res.status(200).json({ msg: 'image uploaded. ' }))
//     next()
// })
// module.exports = uploadImage