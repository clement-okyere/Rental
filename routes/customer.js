const express = require('express')
const route = express.Router();
const {Customer} = require('../db/models/customer')
const {customerSchema, validate,getErrorMessage} = require('../utils/validation')


route.get('/', async (req, res) => {
    const customers = await Customer
        .find()
        .sort('name')
    res.send(customers)
})


route.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send(`Customer with id ${req.params.id} does not exist`)
    res.send(customer)
})


route.post('/', async (req, res) => {
    // const customer = await Customer.findById(req.params.id)
    // if (!customer) return res.status(404).send(`Customer with id ${id} does not exist`)

    const { error } = validate(customerSchema, req.body)
    if (error) return res.status(400).send(getErrorMessage(error))

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })

    await customer.save()
    res.send(customer)
})


route.put('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
        },
        {
            new: true
        }
    )
    if (!customer) return res.status(404).send(`Customer with id ${id} does not exist`)

    const { error } = validate(customerSchema, req.body)
    if (error) return res.status(400).send(getErrorMessage(error))

    res.send(customer)
})


route.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(
        req.params.id
    )
    if (!customer) return res.status(404).send(`Customer with id ${id} does not exist`)
    res.send(customer)
})

module.exports = route;