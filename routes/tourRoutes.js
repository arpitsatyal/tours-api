let express = require('express')
let Router = express.Router()
let tourController = require('../controllers/tourController')
let authController = require('../controllers/authController')
let reviewRouter = require('../routes/reviewRoute')

Router.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours)
Router.get('/most-expensive-tours', 
tourController.mostExpensiveTours, tourController.getAllTours)


Router.use('/:tourId/reviews', reviewRouter)

Router.route('/')
.get(tourController.getAllTours)
    
.post(authController.protect, tourController.createTour)

Router.route('/:id')

.get(tourController.getTour)

.patch(authController.protect, tourController.updateTour)

.delete(authController.protect, tourController.deleteTour)

Router.post('/search', tourController.searchTour)

module.exports = Router
