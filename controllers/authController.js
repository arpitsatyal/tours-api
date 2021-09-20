let jwt = require('jsonwebtoken')
let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')
let sendEmail = require('../utils/email')
let crypto = require('crypto')
let mapUsers = require('../utils/map_users')

let signToken = id => jwt.sign({ id }, process.env.JWT_SECRET)

let sendToken = (user, statusCode, res) => {
    let token = signToken(user._id)
    res.status(statusCode).json({
        token,
        user
    })
}

exports.signUp = catchAsync(async (req, res, next) => {
    let toCreate = mapUsers({}, req.body)
    let newUser = await User.create(toCreate)
    sendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
    let { username, password } = req.body
    let user = await User.findOne({ username })
    if (!user) return next({
        status: 404,
        error: 'no such user exists.'
    })
    let isMatch = await user.verifyPassword(password, user.password)
    if (!isMatch) return next({
        status: 400,
        error: 'invalid credentials'
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

exports.forgotPassword = async (req, res, next) => {
    let { email } = req.body
    if (!email) return next({ error: 'plz provide email' })
    let user = await User.findOne({ email })
    if (!user) return next({
        status: 400,
        error: 'invalid email'
    })

    // generate random reset token
    let resetToken = user.createResetToken()
    await user.save({ validateBeforeSave: false })

    // send the front end url
    let resetURL = `${req.headers.origin}/auth/resetPassword/${resetToken}`
    // console.log(resetURL)
    let message = `forgot yer password? dont worry, submit this with your new password to ${resetURL}`
    try {
        await sendEmail({
            message, email: user.email,
            subject: 'password reset token'
        })
        res.status(200).json({
            status: 'success',
            msg: 'token sent to client'
        })

    } catch (e) {
        console.log(e)
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })
        return next({
            status: 500,
            error: 'error sending the email, try again'
        })
    }
}

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1 get user based on the token
    let hashedToken = crypto.createHash('sha256')
    .update(req.params.token)
    .digest('hex')

    // 2 if token hasnt expired and if there is user, set the new psd
    let user = await User.findOne({ 
        passwordResetToken: hashedToken,
        passwordResetExpires:  { $gte: Date.now() }
    })
    if(!user) return next( { error: 'token has expired' } )

        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()

    // 4 log the user in
    sendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async(req, res, next) => {
    // 1 get user
    let user = await User.findById(req.user._id).select('+password')
    // 2 verify password
    console.log('current=',req.body.passwordCurrent)
    console.log('psd=', req.body.password)
    console.log('confirm=',req.body.passwordConfirm)

    let isMatch = await user.verifyPassword(req.body.passwordCurrent, user.password)
    if(!isMatch) return next({error: 'invalid current password'})
    // 3 update password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    // 4 log the user in, send jwt
    sendToken(user, 200, res)
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next({
                status: 403,
                error: 'not authorized, dude.'
            })
        }
        next()
    }
}