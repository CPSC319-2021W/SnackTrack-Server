var express = require('express')
var addUser = require('./controller')
var router = express.Router()

/* GET users listing. */
router.post('/', addUser)

module.exports = router;
