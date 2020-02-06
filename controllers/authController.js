let jwt = require('jsonwebtoken')
let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')

let signToken = id => jwt.sign({ id }, process.env.JWT_SECRET)

let sendToken = (newUser, statusCode, res) => {
    let token = signToken(newUser._id)
    res.status(statusCode).json({
        token,
        newUser
    })
}

exports.signUp = catchAsync(async (req, res, next) => {
    let newUser = await User.create(req.body)
    sendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
    let { name, password } = req.body
    let user = await User.findOne({ name })
    if (!user) return next({
        status: 404,
        error: 'no such user exists.'
    })
    let isMatch = await user.verifyPassword(password, user.password)
    if (!isMatch) return next({
        status: 400,
        error: 'invalid password'
    })
    sendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
    // console.log(req.headers.authorization)
    if (!req.headers.authorization) {
        return next({
            status: 404,
            error: 'token not provided'
        })
    }
    let token = req.headers.authorization.split(' ')[1]
    let verified = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(verified) => has iat and id
    let user = await User.findById(verified.id)
    req.user = user
    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
       if(!roles.includes(req.user.role)) {
           return next({
               status: 403,
               error: 'not authorized, dude.'
           })
       }
        next()
    }
}