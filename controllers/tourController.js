let Tour = require('../models/tourModel')
let catchAsync = require('../utils/catchAsync')
let mapTours = require('../utils/map_tour')
let Review = require('../models/reviewModel')
let cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


exports.aliasTopTours = catchAsync(async (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,summary,difficulty'
    next()
})

exports.mostExpensiveTours = catchAsync(async (req, res, next) => {
    let condition = req.query.price = { gt: 2000 }
    console.log(condition)
    next()
})

exports.getAllTours = catchAsync(async (req, res, next) => {
    //FILTER
    let queryObject = { ...req.query }
    let toExclude = ['page', 'sort', 'limit', 'fields']
    toExclude.forEach(el => delete queryObject[el])

    let queryString = JSON.stringify(queryObject)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    let updatedQueryString = JSON.parse(queryString)
    // console.log(updatedQueryString)
    let query = Tour.find(updatedQueryString)
    // SORT
    if (req.query.sort) {
        // console.log('req.query here', req.query) => sort does exist here
        let sortBy = req.query.sort.replace(',', ' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }
    // LIMIT
    if (req.query.fields) {
        let fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)
    } else {
        query = query.select('-__v')
    }
    // PAGINATION
    let numTours = await Tour.countDocuments()
    let page = req.query.page * 1 || 1
    let toLimit = req.query.limit * 1 || numTours.length
    let toSkip = (page - 1) * toLimit
    query = query.skip(toSkip).limit(toLimit)
    if (req.query.page) {
        if (toSkip >= numTours) return next({ error: 'no tours left mate' })
    }
    // console.log(req.query)
    let tours = await query
    res.status(200).json({
        status: 'success',
        total: tours.length,
        tours,
        numTours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
    let tour = await Tour.findById(req.params.id).populate('reviews')
    res.status(200).json({
        status: 'success',
        tour
    })
})

exports.createTour = catchAsync(async (req, res, next) => {
    let toCreate = {}
    mapTours(toCreate, req.body.tour)
    let tour
    cloudinary.uploader.upload(req.body.image)
    .then(async response => {
        tour = await new Tour({
           ...toCreate,
            owner: req.user._id,
            imgId: response.public_id,
            imgVersion: response.version
        })
        await tour.save()
            res.status(201).json({ status: 'success', tour })
    })
    .catch(err => next(err))
})

exports.updateTour = catchAsync(async (req, res, next) => {
    let toUpdate = {}
    mapTours(toUpdate, req.body.tour)

    if(req.body.image) {
        cloudinary.uploader.upload(req.body.image)
        .then(async response => {
            let imgBody = {
                imgId: response.public_id,
                imgVersion: response.version
            }
            updated = await Tour.findByIdAndUpdate(req.params.id, {
                ...toUpdate,
                imgVersion: imgBody.imgVersion,
                imgId: imgBody.imgId
            }, { new: true })
        })
    } else { 
        Tour.findByIdAndUpdate(req.params.id, {...toUpdate }, { new: true })
        .then(async doc => {
            if (req.body.tour.startDate) await Tour.findByIdAndUpdate(req.params.id, { $push: { startDates: req.body.tour.startDate } })
            if (req.body.tour.locations.hasOwnProperty('description')) {
                await Tour.findByIdAndUpdate(req.params.id, {
                    $push: { locations: { description: req.body.tour.locations.description } }
                })
                let locations = []
                let tour = await Tour.findById(req.params.id)
                locations = tour.locations
                locations.forEach(async loc => {
                    if (loc.description === req.body.tour.locations.description) if (req.body.tour.locations.longitude && req.body.tour.locations.latitude) {
                        loc.coordinates.push(req.body.tour.locations.latitude, req.body.tour.locations.longitude)
                        await tour.save()
                    }
                })
            }
            if (req.body.tour.startLocation.hasOwnProperty('description')) {
                await Tour.findByIdAndUpdate(req.params.id, { $set: { 'startLocation.description': req.body.tour.startLocation.description } })
            }
            res.status(200).json({
                status: 'sucess',
                doc
            })
        })
    }
})

exports.searchTour = catchAsync(async (req, res, next) => {
    let condition = {}
    mapTours(condition, req.body)
    // console.log(req.body)
    console.log('condition', condition)
    let final = []
    Tour.find(condition)
        .then(async tours => {
            if (req.body.startLocation.hasOwnProperty('description')) {
                let withStartLocation = await Tour.find({ 'startLocation.description': req.body.startLocation.description })
                tours.forEach(tour => {
                    withStartLocation.forEach(loc => {
                        if (tour.name === loc.name) final.push(loc)
                    })
                })
            } else {
                final = tours
            }
            res.status(200).json({
                status: 'success', results: final.length, final
            })
        })
        .catch(err => next(err))
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    await Review.deleteMany({ tour: req.params.id })
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json(null)
})


