const express = require('express')
const api = require('./api')
var router = express.Router()

router.get('/getAnonymous', api.getRainbowAnonymousGuest)

module.exports = router