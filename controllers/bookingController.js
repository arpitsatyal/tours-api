let Tour = require('../models/tourModel')
let catchAsync = require('../utils/catchAsync')
let stripe = require('stripe')(process.env.STRIPE_SECRET)

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    //  1 get currently booked tour
    let tour = await Tour.findById(req.params.tourId)
    // 2 create a checkout session
    let session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: 'localhost:8080/api/tours',
        // cancel_url: req.headers.origin,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [{
            name: tour.name,
            description: tour.summary,
            amount: tour.price * 100,
            currency: 'usd',
            quantity: 1
        }]
    })
    console.log(session)
    // 3 create a session as response
    res.status(200).json(session)
})