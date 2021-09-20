let mongoose = require('mongoose')
let Tour = require('./tourModel')

let reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    }, 
    rating: {
        type: Number,
        default: 0,
        max: 5,
        validate(val) {
            return val <= 5
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
    this.populate({path: 'tour writer'})
    next()
})

reviewSchema.statics.calcAvgRatings = async function(tourID) {
    try {
   let stats = await this.aggregate([
       {
           $match: {tour: tourID }
       }, {
           $group: {
               _id: '$tour',
               numRatings: { $sum: 1 },
               avgRatings: { $avg: '$rating'}
           }
       }
   ])
   if(stats.length > 0) {
    await Tour.findByIdAndUpdate(tourID, {
        ratingsAverage: stats[0].avgRatings,
        ratingsQuantity: stats[0].numRatings
       })
       console.log(stats)
    } else {
        await Tour.findByIdAndUpdate(tourID, {
            ratingsAverage: 0,
            ratingsQuantity: 0
           })
           console.log('eta', stats)
    }
} catch (e) { console.log(e) }
}

reviewSchema.post('save', function() {
    this.constructor.calcAvgRatings(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.rev = await this.findOne()
    next()
})

reviewSchema.post(/^findOneAnd/, async function() {
    await this.rev.constructor.calcAvgRatings(this.rev.tour._id)
})

let reviewModel = mongoose.model('Review', reviewSchema)

module.exports = reviewModel 
