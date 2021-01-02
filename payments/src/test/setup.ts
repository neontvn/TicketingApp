import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

import jwt from 'jsonwebtoken';

declare global{
    namespace NodeJS {
        interface Global {
            signup(id?:string) : string[];
        }
    }
}

jest.mock('../nats-wrapper');


let mongo: any;
beforeAll(async ()=>{

    process.env.JWT_KEY = 'asdf';
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    });

});

beforeEach(async ()=>{
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});


afterAll(async ()=>{
    await mongo.stop();
    await mongoose.connection.close();
})

global.signup = (id?: string) => {
   // Build a jwt payload { id, email }
   const payload = {
       id : id || new mongoose.Types.ObjectId().toHexString(),
       email : 'test@test.com'
   }

   // create the jwt
   const token = jwt.sign(payload, process.env.JWT_KEY!);

   // build session object 
   const session = { jwt : token };

   // turn that into json
   const sessionJSON = JSON.stringify(session);

   // take the json and encode as base64
   const base64 = Buffer.from (sessionJSON).toString("base64");

   // return a string thats the cookie in required format

   return [`express:sess=${base64}`];

}