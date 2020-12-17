import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@hungryshark/common';

import { User } from '../models/user';
import jwt from 'jsonwebtoken';



const router = express.Router();

// Route handler to sign-up
router.post('/api/users/signup',
[ 
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),

    body('password')
        .trim()
        .isLength({ min : 4, max : 20 })
        .withMessage('Password must be between 4 and 20 characters')

],
validateRequest,
async (req : Request,res : Response )=>{

    const { email,password } = req.body;
    
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if(existingUser){        
        throw new BadRequestError("Email already in use")
    }

    const user = User.build({
        email, password
    })

    await user.save();
    
    // Generate Token using jsonwebtoken

    const userJWT = jwt.sign({
        id : user.id,
        email : user.email
    },
    process.env.JWT_KEY!
    );

    // Store it in a Session object
    req.session = {
        jwt : userJWT
    }
    
    res.status(201).send(user);

});

export { router as signupRouter };