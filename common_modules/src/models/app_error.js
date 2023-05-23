class AppError extends Error{
    constructor(statusCode,message,stack){
        super(message);
        this.statusCode = statusCode;
        this.stack = stack || this.stack;
    }
}

module.exports = AppError;