let express = require('express')
let Router = express.Router()
let tourController = require('../controllers/tourController')
let authController = require('../controllers/authController')
let reviewRouter = require('../routes/reviewRoute')

Router.use('/:tourId/reviews', reviewRouter)

Router.route('/')
.get(authController.protect,
    tourController.getAllTours)
    
.post(authController.protect,
    tourController.createTour)

Router.route('/:id')
.patch(tourController.updateTour)
.delete(tourController.deleteTour)

module.exports = Router