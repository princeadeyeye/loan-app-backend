const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const pool = require('./DB/db-query')


// USER ROUTES
const userRoute = require('./Routes/user-routes')
const authRoute = require('./Routes/auth-routes')


// express
const app = express();

// MIDDLEWARE
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cookieParser())


// ROUTES
app.use('/', userRoute)
app.use('/', authRoute)








module.exports = app