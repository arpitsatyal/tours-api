let express = require('express')
let app = express()
let morgan = require('morgan')
let userRoutes = require('./routes/userRoutes')
let tourRoutes = require('./routes/tourRoutes')
let reviewRoutes = require('./routes/reviewRoute')

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRoutes)
app.use('/api/tours', tourRoutes)

// next(arg) => yo arg ma j pathayo tyo err ma auxa.

app.use((err, req, res, next) => {
    console.log('i am err handling middleware')
    err.status = err.status || 400
    res.status(err.status).json({
        error: err.message || err
     })
})

module.exports = app