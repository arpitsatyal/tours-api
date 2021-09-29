module.exports = function(obj1, obj2) {
    if (obj2.name) {
        obj1.name = obj2.name
    }
    if (obj2.duration) {
        if(typeof(obj2.duration) === 'string') {
            switch (obj2.duration) {
                case '0-10': obj1.duration = { $gt: 0, $lt: 10 }
                break
                case '10-20': obj1.duration = { $gt: 10, $lt: 20 }
                break
                case '20 +': obj1.duration = { $gt: 20 }
            }
        } else {
            obj1.duration = obj2.duration
        }
    }

    if (obj2.maxGroupSize) {
        if(typeof(obj2.maxGroupSize) === 'string') {
            switch (obj2.maxGroupSize) {
                case '0-10': obj1.maxGroupSize = { $gt: 0, $lt: 10 }
                break
                case '10-20': obj1.maxGroupSize = { $gt: 10, $lt: 20 }
                break
                case '20 +': obj1.maxGroupSize = { $gt: 20 }
            }
        } else {
            obj1.maxGroupSize = obj2.maxGroupSize
        }
    }

    if (obj2.difficulty) {
        obj1.difficulty = obj2.difficulty
    }
    if (obj2.minPrice) {
        obj1.price = { $gte: obj2.minPrice }
    }
    if (obj2.maxPrice) {
        obj1.price = { $lte: obj2.maxPrice }
    }
    if (obj2.maxPrice && obj2.minPrice) {
        obj1.price = { $gte: obj2.minPrice, $lte: obj2.maxPrice }
    }
    if(obj2.price) {
        obj1.price = obj2.price
    }
    if (obj2.summary) {
        obj1.summary = obj2.summary
    }
    if (obj2.images) {
        obj1.images = obj2.images
    }
    if (obj2.imageCover) {
        obj1.imageCover = obj2.imageCover
    }
    return obj1
}