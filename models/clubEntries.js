const mongoose = require('mongoose');
const clubjoin = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    clubname: {
        type: String,
        required: true
    },
    insta: {
        type: String,
        required: true
    },
    roll: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    payment: {
        type: Number,
        required: true
    },
    is_admin: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('clubEntries', clubjoin);
