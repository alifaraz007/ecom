const router = require('express').Router()
const faker = require('faker')
const Category = require('../models/categorymodel')
const Product = require('../models/productmodel')
const async = require('async')

//creating fake products
router.get('/:name', (req, res, next) => {
    async.waterfall([
        function (callback) {
            Category.findOne({ name: req.params.name }, function (err, category) {
                if (err) return next(err)
                callback(null, category)
            })
        },
        function (category, callback) {
            for (var i = 0; i < 30; i++) {
                const product = new Product()
                product.category = category._id
                product.name = faker.commerce.productName()
                product.price = faker.commerce.price()
                product.image = faker.image.image()

                product.save()
            }
        }
    ])
    res.json('successful')
})

module.exports = router