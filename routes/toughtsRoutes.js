const express = require('express')
const router = express.Router()

// controller
const ToughtsController = require('../controllers/ToughtsController')

router.get('/', ToughtsController.showTougths)

module.exports = router