const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 150
    },
    isGold: {
        type: Boolean,
        required: true,
        default: false
    },
    phone: {
        type: String,
        required: true
    }
})

const Customer = mongoose.model('Customer', customerSchema);
module.exports = {
    Customer,
    customerSchema
}
