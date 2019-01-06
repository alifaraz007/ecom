const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const secret = require('./config/secret')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport')

const app = express()

//connecting mongodb
mongoose.connect(secret.database, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('mongodb connected');
    }
})
mongoose.set('useCreateIndex', true);

// middlewares
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(session({
    secret: secret.secretKey,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ url: secret.database, autoReconnect: true })
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//giving req.user to every routes
app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})

const mainRoute = require('./routes/main')
const userRoute = require('./routes/user')
const adminRoute = require('./routes/admin')
const apiRoute = require('./api/api')
app.use(mainRoute)
app.use('/user', userRoute)
app.use('/admin', adminRoute)
app.use('/api', apiRoute)

const port = 3000;
app.listen(port, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`now listening to port ${port}`);

    }
})