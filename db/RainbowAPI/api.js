const rainbowFunction = require('./function/createAnonymousAcc')


// creating all the api function if needed
exports.getRainbowAnonymousGuest = (req, res, next) => {
    rainbowFunction.rainbowAnonymousGuest()
    .then((guest) => {
        res.status(200).send(guest)
    })
    .catch(err => {
        console.log(err)
        res.status(500).send("Error")
    })
}