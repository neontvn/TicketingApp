import { CustomError } from './custom-error';

//Defining a new Custom error
export class NotFoundError extends CustomError {
    statusCode = 404;
    constructor(){
        super("Not found");
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(){
        return [{ message : "Not Found" }];
    }
}