'use strict';

const userRoutes = require('./user_routes');

module.exports = (app) => {
    app.use('/api', userRoutes);
}