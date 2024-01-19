const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

require('./database/index.js');
const routes = require('./routes.js');

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(helmet());
        this.server.use(
            morgan(
                ':method :url :status :res[content-length] - :response-time ms'
            )
        );
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }
}

module.exports = new App().server;
