let express = require('express')
let app = express()
let morgan = require('morgan')
let path = require('path')
require('dotenv').config({ path: './config.env' })

let userRoutes = require('./routes/userRoutes')
let tourRoutes = require('./routes/tourRoutes')
let reviewRoutes = require('./routes/reviewRoute')
let bookingRoutes = require('./routes/bookingRoute')

let cors = require('cors')
app.use(morgan('dev'))
app.use(express.json({limit: '200mb'}))
app.use(express.urlencoded({ extended: true, limit: '200mb' }))
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/users', userRoutes)
app.use('/api/tours', tourRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/bookings', bookingRoutes)

app.use((err, req, res, next) => {
    console.log('i am err handling middleware')
    console.log('err status', err.status)
    console.log(err)
    err.status = err.status || 400
    res.status(err.status).json({
        error: err.message || err
     })
})

module.exports = app