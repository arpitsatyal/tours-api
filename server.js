let app = require('./app')
let mongoose = require('mongoose')

// mongoose.connect('mongodb+srv://arpit:okcomputer@cluster0.0lu7v.mongodb.net/toursapi?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// })
// .then(() => console.log('database connected!'))

mongoose.connect('mongodb://localhost:27017/newnatours', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('database connected!'))

app.listen(process.env.PORT || 8080, () => console.log(`app is listening at ${process.env.PORT || 8080}`))