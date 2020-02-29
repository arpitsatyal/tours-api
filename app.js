let express = require('express')
let app = express()
let morgan = require('morgan')
let userRoutes = require('./routes/userRoutes')
let tourRoutes = require('./routes/tourRoutes')
let reviewRoutes = require('./routes/reviewRoute')
let cors = require('cors')
let path = require('path')

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/users', userRoutes)
app.use('/api/tours', tourRoutes)
app.use('/api/reviews', reviewRoutes)

// next(arg) => yo arg ma j pathayo tyo err ma auxa.

app.use((err, req, res, next) => {
    console.log('i am err handling middleware')
    console.log(err)
    err.status = err.status || 400
    res.status(err.status).json({
        error: err.message || err
     })
})

module.exports = app