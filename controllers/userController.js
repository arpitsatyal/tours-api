let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')
let mapUsers = require('./../utils/map_users')
let Review = require('../models/reviewModel')
let cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


exports.getAllUsers = catchAsync(async (req, res, next) => {
    let users = await User.find().select('-__v').select('-password')
    res.status(200).json({
        status: 'success',
        total: users.length,
        users
    })
})

exports.getUser = catchAsync(async (req, res, next) => {
    // select: {'owner': 0}
    let user = await User.findById(req.params.id).populate({ path: 'reviews', select: { '__v': 0 } }).select('-password')
    res.status(200).json({
        status: 'success',
        user
    })
})

exports.updateUser = catchAsync(async (req, res, next) => {
    let updated
    let toUpdate = {}
    mapUsers(toUpdate, req.body.user)
    if(req.body.image) {
        cloudinary.uploader.upload(req.body.image)
        .then(async response => {
            let imgBody = {
                imgId: response.public_id,
                imgVersion: response.version
            }
            updated = await User.findByIdAndUpdate(req.params.id, {
                ...toUpdate,
                imgVersion: imgBody.imgVersion,
                imgId: imgBody.imgId
            }, { new: true })
            res.status(200).json({
                status: 'sucess',
                updated
            })
        })
    } else {
        updated = await User.findByIdAndUpdate(req.params.id, {
            ...toUpdate
        }, { new: true })
        res.status(200).json({
            status: 'sucess',
            updated
        })
    }
})

exports.deleteUser = catchAsync(async (req, res, next) => {
    await Review.deleteMany({ writer: req.user._id })
    await User.findByIdAndDelete(req.params.id)
    res.status(204).json(null)
})

// exports.checkUsername = (req, res, next) => {
//     let condition = {}
//     condition.username = req.params.username
//     User.findOne(condition)
//         .then(data => {
//             console.log(data)
//             // console.log(data) => if query gives null then falsy value
//             if (data) {
//                 res.status(200).json(data)
//             } else {
//                 next({ error: 'user aint found' })
//             }
//         })
// }
