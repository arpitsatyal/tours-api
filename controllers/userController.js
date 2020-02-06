let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')

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
    let user = await User.findById(req.params.id).populate({path: 'tours', select: {'__v': 0}}).select('-password')
    res.status(200).json({
        status: 'success',
        user
    })
})

exports.updateUser = catchAsync(async(req, res, next) => {
    let updated = await User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })
    res.status(200).json({
        status: 'sucess',
        updated
    })
})

exports.deleteUser = catchAsync(async(req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
    res.status(204).json(null)
})