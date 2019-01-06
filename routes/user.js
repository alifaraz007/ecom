const router = require('express').Router()
const User = require('../models/usermodel')
const passport = require('passport')
const passportConfig = require('../config/passport')

router.post('/signup', async (req, res, next) => {
    try {
        const user = new User()
        user.profile.name = req.body.name
        user.password = req.body.password
        user.email = req.body.email
        user.profile.picture = user.gravatar()

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).json('email already existed')
        } else {
            const newUser = await user.save();
            req.logIn(user, function (err) {
                if (err) { return next(err) }
                res.redirect('/ecom/profile')
            })
        }
    } catch (err) {
        console.log(err)
    }
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/ecom/profile',
    failureRedirect: '/ecom/login',
    failureFlash: true
}))

router.get('/profile', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id })
        res.json(user)
    } catch (err) {
        res.status(400).json(err)
    }
})

router.get('/logout', (req, res, next) => {
    req.logout();
    res.json('logged out')
})

router.post('/edit-profile', async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id })
        if (req.body.name) { user.profile.name = req.body.name }
        if (req.body.address) { user.address = req.body.address }
        const editedUser = await user.save()
        return res.redirect('/ecom/profile');
    } catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router;