import express, { Response, Request } from 'express';
 
const router = express.Router();

router.get('/api/orders', async( req : Request,res: Response ) =>{
    res.send({});
})

export { router as indexOrderRouter };