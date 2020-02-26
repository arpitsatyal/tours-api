let express = require('express')
let Router = express.Router()
let userController = require('../controllers/userController')
let authController = require('../controllers/authController')
let multerConfig = require('../utils/multerConfigs')

Router.post('/login', authController.login)
Router.post('/signup', authController.signUp)
Router.post('/forgotPassword', authController.forgotPassword)
Router.patch('/resetPassword/:token', authController.resetPassword)
Router.get('/checkUsername/:username', userController.checkUsername)

Router.use(authController.protect)
Router.patch('/changePassword', authController.updatePassword)

Router.route('/')
    .get(userController.getAllUsers)

Router.route('/:id')
    .get(userController.getUser)

    .patch(multerConfig.setMulter,
        multerConfig.uploadSingle,
        userController.updateUser)

    .delete(userController.deleteUser)

module.exports = Router