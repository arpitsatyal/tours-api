let catchAsync = require('../utils/catchAsync')
let Review = require('../models/reviewModel')

exports.setTourAndUserIds = (req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user._id
    next()
}

exports.getAllReviews = catchAsync(async(req, res, next) => {
    let reviews = await Review.find({tour: req.body.tour, writer: req.user._id})
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
    let reviews = await Review.create({
        ...req.body,
        writer: req.body.user,
        tour: req.body.tour

    })
    res.status(200).json({
        status: 'success',
        total: reviews.length,
        reviews
    })
})

exports.updateReview = catchAsync(async(req, res, next) => {
    let updated = await Review.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
    res.status(200).json({
        status: 'success',
        updated
    })
})

exports.deleteReview = catchAsync(async(req, res, next) => {
    await Review.deleteMany()
    res.status(204).json(null)
})