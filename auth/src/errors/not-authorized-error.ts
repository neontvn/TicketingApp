import { CustomError } from './custom-error';

//Defining a new Custom error
export class NotAuthorizedError extends CustomError {
    
    statusCode = 400;
    constructor(public message : string){
        super(message);
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors(){
        return [{ message : this.message }];
    }
}