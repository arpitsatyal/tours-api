module.exports = function(obj1, obj2) {
    if(obj2.name) {
        obj1.name = obj2.name
    }
    if(obj2.duration) {
        obj1.duration = obj2.duration
    }
    if(obj2.maxGroupSize) {
        obj1.maxGroupSize = obj2.maxGroupSize
    }
    if(obj2.difficulty) {
        obj1.difficulty = obj2.difficulty
    }
    if(obj2.price) {
        obj1.price = obj2.price
    }
    if(obj2.summary) {
        obj1.summary = obj2.summary
    }
    if(obj2.images) {
        obj1.images = obj2.images
    }
    if(obj2.imageCover) {
        obj1.imageCover = obj2.imageCover
    }
    return obj1
}