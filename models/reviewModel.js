let mongoose = require('mongoose')

let reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 10
    }, 
    rating: {
        type: Number,
        default: 0,
        min: 0.1,
        max: 5,
        validate(val) {
            return val <=5
        }
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
    },
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

reviewSchema.pre(/^find/, function(next) {
    this.populate({path: 'tour'})
    next()
})

reviewSchema.set('toObject', { virtuals: true })
reviewSchema.set('toJSON', { virtuals: true })

let reviewModel = mongoose.model('Review', reviewSchema)

module.exports = reviewModel 

// nested routes => tour/tourid/reviews