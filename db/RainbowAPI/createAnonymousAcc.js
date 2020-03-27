const rainbowSDK = require('./config/rainbowSDK')

const ttl = 3600
exports.getRainbowAnonymousGuest = (req, res, next) => {
    rainbowAnonymousGuest()
    .then((guest) => {
        res.status(200).send(guest)
    })
    .catch(err => {
        console.log(err)
        res.status(500).send("Error")
    })
}

const rainbowAnonymousGuest = () => {
    return new Promise((res, rej) => {
        rainbowSDK.admin.createAnonymousGuestUser(ttl)
        .then((guest) => {
            res({
                loginEmail: guest.loginEmail,
                password: guest.password})
        })
        .catch(err => {
            rej(err)
        })
    })

}