let express = require('express')
let Router = new express.Router({mergeParams: true })
let reviewController = require('../controllers/reviewController')
let authController = require('../controllers/authController')

Router.route('/')
.get(authController.protect,
    reviewController.setTourAndUserIds,
    reviewController.getAllReviews)

.post(authController.protect,
    reviewController.setTourAndUserIds,
    reviewController.createReview)


Router.use('/reviews/delete', reviewController.deleteReview)
module.exports = Router