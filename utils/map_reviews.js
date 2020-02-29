module.exports = function(obj1, obj2) {
    if(obj2.name) {
        obj1.name = obj2.name
    }
    if(obj2.rating) {
        obj1.rating = obj2.rating
    }
    
    return obj1
}