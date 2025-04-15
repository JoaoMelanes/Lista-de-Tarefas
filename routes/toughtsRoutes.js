const express = require('express')
const router = express.Router()
const checkAuth = require('../helpers/auth').checkAuth

// controller
const ToughtsController = require('../controllers/ToughtsController')

//routes
router.get('/add', checkAuth, ToughtsController.createTought)
router.post('/add', checkAuth, ToughtsController.createToughtSave)
router.get('/edit/:id', checkAuth, ToughtsController.editTought)
router.post('/edit', checkAuth, ToughtsController.updateTought)
router.get('/dashboard', checkAuth, ToughtsController.dashboard)
router.post('/delete', checkAuth, ToughtsController.deleteTought)
router.get('/', checkAuth, ToughtsController.showTougths)

module.exports = router