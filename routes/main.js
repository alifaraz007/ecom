const router = require('express').Router()
const Product = require('../models/productmodel')

//getting all products
router.get('/products/:id', (req, res, next) => {
    Product
        .find({ category: req.params.id })
        .populate('category')
        .exec((err, products) => {
            if (err) { return next(err) }
            res.json(products)
        })
})

module.exports = router