const express = require('express')
const api = require('./createAnonymousAcc')
var router = express.Router()

router.get('/getAnonymous', api.getRainbowAnonymousGuest)

module.exports = router