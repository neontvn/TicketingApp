import { requireAuth, validateRequest } from '@hungryshark/common';
import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/orders', requireAuth,[ 
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input:string)=> mongoose.Types.ObjectId.isValid(input) ) // Validation that ticket Id is a MongoId
        .withMessage('Ticket id not defined')
], validateRequest,
async( req : Request,res: Response ) =>{
    
})

export { router as newOrderRouter };