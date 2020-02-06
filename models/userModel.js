let mongoose = require('mongoose')
let validator = require('validator')
let bcrypt = require('bcryptjs')

let userSchema = new mongoose.Schema({
    name: {
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
        enum: ['user', 'admin', 'guide'],
        default: 'user'
    }
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
    next()
})

userSchema.methods.verifyPassword = async function(p1, p2) {
    return await bcrypt.compare(p1, p2)
}

let userModel = mongoose.model('User', userSchema)

module.exports = userModel 