'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});

UserSchema.pre('save', function (next) {

    bcrypt.genSalt((err, salt) => {

        if (err) {
            return next(err);
        }
        bcrypt.hash(this.password, salt, (err, encrypted) => {

            if (err) {
                return next(err);
            }

            this.password = encrypted;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.set('toJSON', { getters: true, virtuals: false });

module.exports = mongoose.model('User', UserSchema);