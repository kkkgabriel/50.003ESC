const express = require('express')
const api = require('./api')
var router = express.Router()

router.route('/getAnonymous')
.get(api.getRainbowAnonymousGuest)


module.exports = router