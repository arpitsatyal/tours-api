let mongoose = require('mongoose')

let tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
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
    ratingsAverage: {
        type: Number,
        min: 0,
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
    location: {
        type: String
    },
    priceDiscount: {
        type: String,
        validate(val) {
            if (val > this.price) throw new Error('discount cannot be greater than the price!')
        }
    },
    summary: {
        type: String,
        trim: true,
        lowercase: true
    },
    startDate: {
        type: Date
    },
    images: [String],
    imageCover: String,
    guides: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}
, {
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
        path: 'owner guides',
        select: 'username profilePic role'
    })
    next()
})

let Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour