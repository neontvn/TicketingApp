import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { 
    BadRequestError, 
    NotAuthorizedError, 
    NotFoundError, 
    OrderStatus, 
    requireAuth, 
    validateRequest 
} from '@hungryshark/common';

import { Order } from '../models/order';


const router = express.Router();

router.post('/api/payments', 
    requireAuth, 
    [
        body('token')
            .not()
            .isEmpty(),

        body('orderId')
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (req: Request,res: Response)=>{
        // Token - authorization to charge the user for money
        // Stripe API is used to send the token and charge for money
        const { token, orderId } = req.body;
        const order = await Order.findById(orderId);

        if(!order){
            throw new NotFoundError();
        }

        if(order.userId!==req.currentUser!.id){
            throw new NotAuthorizedError();
        }

        if(order.status===OrderStatus.Cancelled){
            throw new BadRequestError("Cannot pay for a cancelled order");
        }
        res.send({ success : true });
});


export { router as createChargeRouter };