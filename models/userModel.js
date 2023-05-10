const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
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
    insta: {
        type: String,
        required: true
    },
    roll: {
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
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Number,
        required: true
    },
    is_verified: {
        type: Number,
        default: 0
    },
    token: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('user', userSchema);

