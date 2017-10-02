'use strict';

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secret = 'my-test-secret';

const emailRegExp =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


exports.login = (req, res, next) => {
    const {email, password} = req.body;

    if (!email) {
        return res.status(400).send('email is required');
    } else if (!emailRegExp.test(email)) {
        return res.status(400).send('email is invalid');
    }

    if (!password) {
        return res.status(400).send('password is required');
    }

    User.findOne({email}, (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(400).send('user does not exists!');
        }

        user.comparePassword(password, (err, isMatched) => {
            if (err) {
                return next(err);
            }

            if (!isMatched) {
                return res.status(400).send('Password not valid!');
            }

            res.send({token: jwt.sign(user.toJSON(), secret)});
        });

    });
};


exports.register = (req, res, next) => {
    const {name, email, password} = req.body;

    if (!name) {
        return res.status(400).send('name is required');
    }

    if (!email) {
        return res.status(400).send('email is required');
    } else if (!emailRegExp.test(email)) {
        return res.status(400).send('email is invalid');
    }

    if (!password) {
        return res.status(400).send('password is required');
    }

    User.findOne({email}, (err, user) => {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.status(400).send('email already in use');
        }

        User.create({name, email, password}, (err, newUser) =>{
            if (err) {
                return next(err);
            }
            res.status(201).send({token: jwt.sign(newUser.toJSON(), secret)});
        });

    });
};

exports.getProfile = (req, res, next) => {
    User.findById(req.decoded._id, (err, user) => {
       if (err) {
           return next(err);
       }
       return res.send(user.toJSON());
    });
};

exports.isAuth = (req, res, next) => {
    let token = req.body.token || req.params.token || req.headers['authorization'];
    if (typeof token !== 'undefined') {
        var bearer = token.split(" ");
        token = bearer[1];
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                return res.status(401).send();
            }
            req.decoded = decoded;
            next();
        });
    } else {
        return res.status(401).send('Authentication failed!');
    }
};