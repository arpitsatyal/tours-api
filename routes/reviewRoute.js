let express = require('express')
let Router = new express.Router({mergeParams: true })
let reviewController = require('../controllers/reviewController')
let authController = require('../controllers/authController')

Router.route('/')
.get(
    reviewController.setTourId,
    reviewController.getAllReviews)

.post(authController.protect,
    reviewController.setTourAndUserIds,
    reviewController.createReview)

.delete(authController.protect,
    authController.restrictTo('admin'),
    reviewController.deleteAllReview)

Router.route('/:id')

.get(
    reviewController.setTourId,
    reviewController.getReview)

.patch(authController.protect,
    reviewController.updateReview)

.delete(authController.protect,
    reviewController.deleteOneReview)

module.exports = Router