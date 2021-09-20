let mongoose = require('mongoose')
let validator = require('validator')
let bcrypt = require('bcryptjs')
let crypto = require('crypto')

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        maxlength: 15,
        minlength: 5
    }, 
    password: {
        type: String,
        required: true,
        minlength: 5
    }, 
    email: {
        type: String,
        unique: true,
        validate(val) {
            if(!validator.isEmail(val)) throw new Error('not a valid email!')
        },
        sparse: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'lead-guide', 'tour-guide'],
        default: 'user'
    },
    profilePic: {
        type: String,
        default: 'default.jpg'
    },
    passwordConfirm: {
        type: String,
        validate: function(val) {
            return val === this.password
        }, 
        message: 'passwords dont match'
    },
    passwordResetToken: String,
    passwordResetExpires: Date
})

userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

userSchema.virtual('tours', {
    ref: 'Tour',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'writer'
})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 16)
    this.passwordConfirm = undefined
    next()
})

userSchema.methods.verifyPassword = async function(p1, p2) {
    return await bcrypt.compare(p1, p2)
}

// resetToken = sent as email
// hashed one = stored in db
userSchema.methods.createResetToken = function() {
    let resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256')
    .update(resetToken)
    .digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}

let User = mongoose.model('User', userSchema)

module.exports = User 


