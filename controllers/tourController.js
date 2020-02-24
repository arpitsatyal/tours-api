let Tour = require('../models/tourModel')
let catchAsync = require('../utils/catchAsync')
let { deleteFile } = require('../utils/multerConfigs')

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
    let toLimit = req.query.limit * 1 || numTours
    let toSkip = (page - 1) * toLimit
    query = query.skip(toSkip).limit(toLimit)
    if (req.query.page) {
        if (toSkip >= numTours) return next({ error: 'no tours left mate' })
    }
    let tours = await query

    res.status(200).json({
        status: 'success',
        total: tours.length,
        tours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
   let tour = await Tour.findById(req.params.id).populate('reviews')
                res.status(200).json({
                    status: 'success',
                    tour
        })
})

exports.createTour = catchAsync(async(req, res, next) => {
    // console.log('reqfiles', req.files.imageCover) => undefined if invalid; set by filter function
    if (req.fileError) { return next({ error: 'invalid file format dude' }) }
    console.log('req body', req.body)
    let tour = await Tour.create({
        ...req.body,
        owner: req.user._id
    })
        res.status(201).json({
            status: 'success',
            total: tour.length,
            tour
    })
})

exports.updateTour = catchAsync(async (req, res, next) => {
    if (req.fileError) { return next({ error: 'invalid file format dude' }) }

    Tour.findById(req.params.id).then(tour => {

        if (req.files.imageCover) {
            if (tour.imageCover) deleteFile(tour.imageCover, 'tours')
            // coz saved in db as tour:imageCover

        } else if (req.files.images) {
            if (tour.images) {
                let allImages = tour.images
                allImages.forEach(image => deleteFile(image, 'tours'))
            }
        }
    }).catch(e => next(e))

    let updated = await Tour.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })
    res.status(200).json({
        status: 'sucess',
        updated
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    let tour = await Tour.findById(req.params.id)
    if (tour.images.length) {
        tour.images.forEach(image => deleteFile(image, 'tours'))
        if (tour.imageCover) deleteFile(tour.imageCover, 'tours')
    }

    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json(null)
})


