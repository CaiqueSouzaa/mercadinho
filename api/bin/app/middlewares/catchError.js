const chalk = require('chalk');

function catchError(err, req, res, next) {
    console.error(chalk.bgRed(err.stack));

    return res.status(500).json({
        message: 'Ocorreu um erro no lado do servidor',
        code: 500,
    });
}

module.exports = catchError;
