let mongoose = require('mongoose')

let tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    maxGroupSize: {
        type: Number
    },
    duration: {
        type: Number
    },
    difficulty: {
        type: String,
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'only select those'
        }
    },
    ratingsAvg: {
        type: Number,
        default: 0,
        min: 0.1,
        max: 5,
        set: function (val) {
            return Math.floor(Math.round(val * 1))
        }
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number
    },
    priceDiscount: {
        type: String,
        validate(val) {
            if (val > this.price) throw new Error('discount cannot be greater than the price!')
        }
    },
    summary: {
        type: String,
        trim: true
    },
    images: [String],
    imageCover: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

tourSchema.set('toObject', { virtuals: true })
tourSchema.set('toJSON', { virtuals: true })

tourSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'tour'
})

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'owner',
        select: 'name'
    })
    next()
})

let tourModel = mongoose.model('Tour', tourSchema)

module.exports = tourModel