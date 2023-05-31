//схема пользователя в базе данных
const mongoose = require('mongoose');
const UserDetails = require('./UserDetails');
const Schema = mongoose.Schema;

const userScheme = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    userDetails: { type: Schema.Types.ObjectId, ref: 'UserDetails'}
});

module.exports = mongoose.model('users', userScheme);