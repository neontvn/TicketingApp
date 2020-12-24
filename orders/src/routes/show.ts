import express, { Response, Request } from 'express';
 
const router = express.Router();

router.get('/api/orders/:orderId', async( req : Request,res: Response ) =>{
    res.send({});
})

export { router as showOrderRouter };