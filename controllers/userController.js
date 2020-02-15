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