let express = require('express')
let Router = express.Router()
let tourController = require('../controllers/tourController')
let authController = require('../controllers/authController')
let reviewRouter = require('../routes/reviewRoute')
let multerConfigs = require('../utils/multerConfigs')

Router.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours)
Router.get('/most-expensive-tours', 
tourController.mostExpensiveTours, tourController.getAllTours)

Router.use(authController.protect)

Router.use('/:tourId/reviews', reviewRouter)

Router.route('/')
.get(tourController.getAllTours)
    
.post(
    multerConfigs.setMulter,
    multerConfigs.uploadSingle,
    multerConfigs.uploadMultiple,
    tourController.createTour)

Router.route('/:id')

.get(tourController.getTour)

.patch(
    multerConfigs.setMulter,
    multerConfigs.uploadSingle,
    multerConfigs.uploadMultiple,
    tourController.updateTour)

.delete(tourController.deleteTour)

Router.post('/search', tourController.searchTour)

module.exports = Router
