let catchAsync = require('../utils/catchAsync')
let Review = require('../models/reviewModel')
let mapReviews = require('../utils/map_reviews')
 
exports.setTourAndUserIds = (req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user._id
    if(!req.body.username) req.body.username = req.user.username
    next()
}

exports.setTourId = (req, res, next) => {
    req.body.tour = req.params.tourId
    next()
}

exports.getAllReviews = catchAsync(async(req, res, next) => {
    
    let reviews = await Review.find({tour: req.body.tour})
    res.status(200).json({
        status: 'success',
        total: reviews.length,
        reviews
    })
})

exports.getReview =  catchAsync(async(req, res, next) => {
    let review = await Review.findById(req.params.id)
    res.status(200).json({
        status: 'success',
        review
    })
})

exports.createReview = catchAsync(async(req, res, next) => {
    let toCreate = mapReviews({}, req.body)
    let reviews = await Review.create({
        ...toCreate,
        writer: req.body.user,
        username: req.body.username,
        tour: req.body.tour

    })
    res.status(200).json({
        status: 'success',
        total: reviews.length,
        reviews
    })
})

exports.updateReview = catchAsync(async(req, res, next) => {
    let toCreate = mapReviews({}, req.body)
    let updated = await Review.findByIdAndUpdate(req.params.id, toCreate, {runValidators: true, new: true})
    res.status(200).json({
        status: 'success',
        updated
    })
})

exports.deleteAllReview = catchAsync(async(req, res, next) => {
    await Review.deleteMany()
    res.status(204).json(null)
})

exports.deleteOneReview = catchAsync(async(req, res, next) => {
    await Review.findByIdAndDelete(req.params.id)
    res.status(204).json(null)
})

exports.getMyReview = catchAsync(async(req, res, next) => {
    console.log('here at controller')
    // let myReviews = await Review.find({username: req.body.username})
    // console.log(myReviews)
    // res.status(200).json({
    //     status: 'success',
    //     myReviews
    // })
})