let app = require('./app')
let mongoose = require('mongoose')
require('dotenv').config( {path: './config.env'} )

mongoose.connect('x', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('database connected!'))

app.listen(process.env.PORT, () => console.log(`app is listening at ${process.env.PORT}`))