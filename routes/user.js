const router = require('express').Router()
const User = require('../models/usermodel')

router.post('/signup', async (req, res, next) => {
    try {
        const user = new User()
        user.profile.name = req.body.name
        user.password = req.body.password
        user.email = req.body.email

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).json('email already existed')
        } else {
            const newUser = await user.save();
            res.json('user created')
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;