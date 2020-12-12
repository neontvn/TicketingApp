import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

// Route handler to get the current user
router.get('/api/users/currentuser', currentUser, requireAuth, (req : Request,res : Response)=>{    
    res.send({ currentUser : req.currentUser || null });
});

export { router as currentUserRouter };