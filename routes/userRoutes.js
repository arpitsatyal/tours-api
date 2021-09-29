let express = require('express')
let Router = express.Router()
let userController = require('../controllers/userController')
let authController = require('../controllers/authController')
let reviewController = require('../controllers/reviewController')

Router.post('/login', authController.login)
Router.post('/signup', authController.signUp)
Router.post('/forgotPassword', authController.forgotPassword)
Router.patch('/resetPassword/:token', authController.resetPassword)
// Router.get('/checkUsername/:username', userController.checkUsername)

Router.use(authController.protect)
Router.patch('/changePassword', authController.updatePassword)

Router.route('/')
    .get(userController.getAllUsers)

Router.route('/:id')
    .get(userController.getUser)

    .patch(userController.updateUser)

    .delete(userController.deleteUser)

Router.get('/myReviews', authController.protect, reviewController.getMyReview)
module.exports = Router