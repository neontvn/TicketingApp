import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
    err: Error,
    req : Request,
    res : Response ,
    next : NextFunction 
) => {

    /*
        
        //Handling this error as Request validation error
        if(err instanceof RequestValidationError){
            
            // This another way in which the error needs to be formatted into the required format
            // This is avoided by creating a function in the class CustomError which returns the formatted
            // array of errors.
            
            const formattedError = err.errors.map(error=>{
                    return { message : error.msg, field : error.param }                
                 })
            return res.status(400).send({errors: formattedError});
            

            return res.status(err.statusCode).send({ errors: err.serializeErrors() });

        }

        //Handling this error as db connection error
        if(err instanceof DatabaseConnectionError){            
            return res.status(err.statusCode).send({ errors: err.serializeErrors() });
        }

        */

        if(err instanceof CustomError){
            return res.status(err.statusCode).send({ errors: err.serializeErrors() });
        }
        
        res.status(400)
            .send({
                errors: [
                    {
                        message : "Something went wrong"
                    }
                ]
            })
}