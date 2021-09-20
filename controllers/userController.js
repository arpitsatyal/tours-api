let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')
let { deleteFile } = require('../utils/multerConfigs')
let mapUsers = require('./../utils/map_users')
let Review = require('../models/reviewModel')

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
    let user = await User.findById(req.params.id).populate({path: 'reviews', select: {'__v': 0}}).select('-password')
    res.status(200).json({
        status: 'success',
        user
    })
})

exports.updateUser = catchAsync(async(req, res, next) => {
    if (req.fileError) { return next({ error: 'invalid file format dude' }) }
    let user = await User.findById(req.params.id)
    if(req.files) {
    if(user.profilePic !== 'default.jpg') {
    deleteFile(user.profilePic, 'users')
    }
}
    console.log('req files', req.files)
    let toUpdate = mapUsers({}, req.body)
    console.log('here',toUpdate)
    let updated = await User.findByIdAndUpdate(req.params.id, toUpdate, {  runValidators: true, new: true })
    res.status(200).json({
        status: 'sucess',
        updated
    })
})

exports.deleteUser = catchAsync(async(req, res, next) => {
    await Review.deleteMany({ writer: req.user._id })
    await User.findByIdAndDelete(req.params.id)
    res.status(204).json(null)
})

exports.checkUsername = (req, res, next) => {
    let condition = {}
    condition.username = req.params.username
    User.findOne(condition)
    .then(data => {
        console.log(data)
        // console.log(data) => if query gives null then falsy value
        if(data) {
        res.status(200).json(data)
        } else {
            next({error: 'user aint found'})
        }
    })
}