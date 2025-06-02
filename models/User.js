const mongoose = require('mongoose');
const express = require('express');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: String,
    role: { type: String, enum: ['buyer', 'seller'], required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
