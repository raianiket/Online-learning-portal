const express = require('express')
const router = express.Router()

const UserController = require('../controllers/UserController')
const User = require('../models/User')

//UI Routes
router.get('/login', UserController.loginForm)
router.get('/editProfile', UserController.editProfile)
router.get('/dashboard', UserController.dashboard)

//Process
router.post('/login', UserController.loginProcess)
router.post('/register', UserController.registerProcess)
router.post('/editProfile', UserController.editProfileProcess)
router.post('/editProfilePassword', UserController.editProfilePasswordProcess)

module.exports = router