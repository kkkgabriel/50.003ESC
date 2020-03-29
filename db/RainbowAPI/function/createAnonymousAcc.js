const rainbowSDK = require('../config/rainbowSDK')

exports.rainbowAnonymousGuest = () => {
    const ttl = 3600
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