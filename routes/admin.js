const router = require('express').Router()
const Category = require('../models/categorymodel')

router.post('/add-category', async (req, res, next) => {
    try {
        const category = new Category()
        category.name = req.body.name

        const cat = await category.save()
        return res.json(cat)
    } catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router