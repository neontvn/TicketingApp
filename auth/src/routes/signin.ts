import express from 'express';

const router = express.Router();

// Route handler to sign-in
router.post('/api/users/signin', (req,res)=>{
    res.send("Hi there!");
});


export { router as signinRouter };