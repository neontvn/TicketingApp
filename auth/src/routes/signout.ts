import express from 'express';

const router = express.Router();

// Route handler to sign-out
router.post('/api/users/signout', (req,res)=>{
    req.session = null;
    res.send({});
});


export { router as signoutRouter };