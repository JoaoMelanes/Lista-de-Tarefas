const express = require('express')
const AuthsController = require('../controllers/authsController')
const router = express.Router()

router.get('/login', AuthsController.login)
router.post('/login', AuthsController.loginPost)
router.get('/register', AuthsController.register)
router.post('/register', AuthsController.registerPost)
router.get('/logout', AuthsController.logout)

module.exports = router