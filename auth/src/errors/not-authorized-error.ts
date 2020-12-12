import { CustomError } from './custom-error';

//Defining a new Custom error
export class NotAuthorizedError extends CustomError {
    
    statusCode = 401;
    constructor(){
        super('Not Authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors(){
        return [{ message : 'Not Authorized' }];
    }
}