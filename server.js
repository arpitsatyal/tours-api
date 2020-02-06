let app = require('./app')
let mongoose = require('mongoose')
require('dotenv').config( {path: './config.env'} )

let port = process.env.PORT

let DB = process.env.DATABASE
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('database connected!'))

app.listen(port, () => console.log(`app is listening at ${port}`))