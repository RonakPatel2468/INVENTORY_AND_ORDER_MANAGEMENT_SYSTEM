const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500; // Default to 500 (server error) if no status code set

    res.status(statusCode);
    res.json({
        message: err.message,
        // Stack trace will be available only in development mode for debugging purposes
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
