let Tour = require('../models/tourModel')
let catchAsync = require('../utils/catchAsync')

exports.getAllTours = catchAsync(async (req, res, next) => {
    let tours = await Tour.find({owner: req.user._id}).select('-__v')
    res.status(200).json({
        status: 'success',
        total: tours.length,
        tours
    })
})

exports.getTour = catchAsync(async(req, res, next) => {
    let tour = await Tour.findById(req.params.id).populate({path: 'reviews', select: {name: 1}})
    res.status(200).json({
        status: 'success',
        tour
    })
})

exports.createTour = catchAsync(async (req, res, next) => {
    // console.log(req.user)
    let newTour = await Tour.create({
        ...req.body,
        owner: req.user._id
    })
    res.status(201).json({
        status: 'success',
        total: newTour.length,
        newTour
    })
})

exports.updateTour = catchAsync(async(req, res, next) => {
    let updated = await Tour.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })
    res.status(200).json({
        status: 'sucess',
        updated
    })
})

exports.deleteTour = catchAsync(async(req, res, next) => {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json(null)
})