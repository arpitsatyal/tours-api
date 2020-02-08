let express = require('express')
let Router = express.Router()
let userController = require('../controllers/userController')
let authController = require('../controllers/authController')

Router.route('/')
.get(authController.protect,
    authController.restrictTo('admin', 'guide'),
    userController.getAllUsers)

.post(authController.signUp)

Router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)

Router.post('/login', authController.login)
Router.post('/forgotPassword', authController.protect, authController.forgotPassword)
Router.patch('/resetPassword/:token', authController.protect, authController.resetPassword)
module.exports = Router