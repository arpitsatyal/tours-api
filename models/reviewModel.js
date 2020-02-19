let mongoose = require('mongoose')
let Tour = require('./tourModel.js')

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
    this.populate({path: 'tour', select: 'name'},
    {path: 'writer', select: 'username'})
    next()
})

reviewSchema.statics.calcAvgRatings = async function(tourID) {
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
   await Tour.findByIdAndUpdate(tourID, {
    ratingsAvg: stats[0].avgRatings,
    ratingsQuantity: stats[0].numRatings
   })
//    console.log(stats)
}

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.rev = await this.findOne()
    next()
})

reviewSchema.post(/^findOneAnd/, async function() {
    await this.rev.constructor.calcAvgRatings(this.rev.tour._id)
})

reviewSchema.post('save', function() {
    this.constructor.calcAvgRatings(this.tour._id)
})

let reviewModel = mongoose.model('Review', reviewSchema)

module.exports = reviewModel 
