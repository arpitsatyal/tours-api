module.exports = allfns => {
    return (req, res, next) => {
        allfns(req, res, next).catch(err => next(err))
    }
}