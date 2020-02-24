let express = require('express')
let Router = express.Router()
let tourController = require('../controllers/tourController')
let authController = require('../controllers/authController')
let reviewRouter = require('../routes/reviewRoute')
let multerConfigs = require('../utils/multerConfigs')

Router.use('/:tourId/reviews', reviewRouter)

Router.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours)
Router.get('/most-expensive-tours', 
tourController.mostExpensiveTours, tourController.getAllTours)

Router.route('/')
.get(authController.protect,
    tourController.getAllTours)
    
.post(authController.protect,
    multerConfigs.setMulter,
    multerConfigs.uploadSingle,
    multerConfigs.uploadMultiple,
    tourController.createTour)

Router.route('/:id')

.get(authController.protect,
    tourController.getTour)

.patch(
    authController.protect,
    multerConfigs.setMulter,
    multerConfigs.uploadSingle,
    multerConfigs.uploadMultiple,
    tourController.updateTour)

.delete(authController.protect,
    tourController.deleteTour)

module.exports = Router
