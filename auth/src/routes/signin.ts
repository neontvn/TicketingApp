import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@hungryshark/common';

import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';


const router = express.Router();

// Route handler to sign-in
router.post('/api/users/signin',
[
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    
        body('password')
            .trim()
            .notEmpty()
            .withMessage("Enter the password")

],
validateRequest,
async (req: Request,res: Response)=>{

    const {email,password} = req.body;
    const existingUser = await User.findOne({ email });
    
    if(!existingUser){
        throw new BadRequestError('Invalid Credentials');
    }
    
    const passwordsMatch = await Password.compare(
        existingUser.password,
        password
    );

    if(!passwordsMatch){
        throw new BadRequestError('Invalid Credentials');
    }

    // Generate Token using jsonwebtoken
    const userJWT = jwt.sign({
        id : existingUser.id,
        email : existingUser.email
    },
    process.env.JWT_KEY!
    );

    // Store it in a Session object
    req.session = {
        jwt : userJWT
    }
    
    res.status(200).send(existingUser);

});


export { router as signinRouter };