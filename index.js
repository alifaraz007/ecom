const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const secret = require('./config/secret')

const app = express()

//connecting mongodb
mongoose.connect(secret.database, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('mongodb connected');
    }
})

// middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cookieParser())
app.use(session({
    secret: secret.secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
app.use(flash());

const userRoute = require('./routes/user')
app.use('/ecom', userRoute)

const port = 3000;
app.listen(port, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`now listening to port ${port}`);

    }
})