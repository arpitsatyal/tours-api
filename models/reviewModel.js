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
    this.populate({path: 'tour', select: 'name'})
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
//    await Tour.findByIdAndUpdate(tourID, {
//     ratingsAvg: stats[0].numRatings,
//     ratingsQuantity: stats[0].avgRatings
//    })
}

reviewSchema.post('save', function() {
    // since calcAvgRatings is defined in schema it will be only available to the models.
    // so constructor will give us access to the document not the model
    this.constructor.calcAvgRatings(this.tour)
})

let reviewModel = mongoose.model('Review', reviewSchema)

module.exports = reviewModel 

// nested routes => tour/tourid/reviews