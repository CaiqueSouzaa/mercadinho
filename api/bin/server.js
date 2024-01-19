require('dotenv/config.js');
const chalk = require('chalk');

const app = require('./app.js');

app.listen(process.env.APP_PORT, () => {
    console.log(
        chalk.bgGreen(`Server is running at port ${process.env.APP_PORT}`)
    );
});
