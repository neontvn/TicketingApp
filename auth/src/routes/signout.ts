import express from 'express';

const router = express.Router();

// Route handler to sign-out
router.post('/api/users/signout', (req,res)=>{
    res.send("Hi there!");
});


export { router as signoutRouter };