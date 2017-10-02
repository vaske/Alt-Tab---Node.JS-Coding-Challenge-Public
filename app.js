'use strict';

const express = require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config.js');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

connect()
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);

function listen () {
    // server routes
    require('./app_server/routes')(app);

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/app_client/index.html');
    });

    app.listen(3000, () => {
        console.log('listening on 3000');
    });
}

function connect () {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    return mongoose.connect(config.mongo_URI, options).connection;
}

module.exports = app;
