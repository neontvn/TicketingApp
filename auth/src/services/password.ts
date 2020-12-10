import {scrypt, randomBytes} from 'crypto'; 
import { promisify } from 'util';

// scrypt - hashing function to use. Callback based
// promisify - function which takes this callback and converts it into
//             promise based implementation

const scryptAsync = promisify(scrypt); // Return a buffer which is an array with raw data 

export class Password {
    // static methods are the methods that we can 
    // create without creating a class

    // Hashing function to store the user password
    static async toHash(password : string){

        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password,salt,64)) as Buffer; // Set the return type of buf earlier unknown

        return `${buf.toString('hex')}.${salt}`;
    }

    // A function to check if the password is correct
    static async compare(storedPassword : string,  suppliedPassword : string){

        const [ hashedPassword, salt ] = storedPassword.split('.');
        const buf = (await scryptAsync(suppliedPassword,salt,64)) as Buffer;

        return buf.toString('hex') == hashedPassword;
    }
}