let express = require('express')
let router = express.Router()
let authController = require('../controllers/authController')
let bookingController = require('../controllers/bookingController')

router.get('/checkout-session/:tourId',
authController.protect, bookingController.getCheckoutSession)

module.exports = router