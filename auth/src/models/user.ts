import mongoose, { Mongoose } from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties required
// to create a new User

interface userAttrs {
    email : string;
    password : string;
}

// An interface that describes the properties that a 
// User Model has

interface UserModel extends mongoose.Model<userDoc>{
    build(attrs:userAttrs) : userDoc;
}

// An interface that describes the properties that a 
// User Document has

interface userDoc extends mongoose.Document {
    email : string;
    password : string;
}


const userSchema = new mongoose.Schema({
    email : {
        type : String,     //specific to mongoose 
        required : true
    },
    password : {
        type : String,
        required : true
    }
},{
    toJSON : {
        transform(doc,ret){
            ret.id =ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

// Using arrow function would mean the context of 'this' to be
// the entire file and not that particular document

userSchema.pre('save', async function(done:any){
   // done() needs to be called once everything is done  
   
   if( this.isModified('password')){
       const hashed = await Password.toHash(this.get('password'));
       this.set('password',hashed);
   }

   done();
});

userSchema.static( 'build', (attrs : userAttrs) => {
    return new User(attrs);
})

const User = mongoose.model<userDoc, UserModel>('User',userSchema);

// <T,U> Generic Type arguments - can be considered as types being 
// provided to a function as arguments. Essentially allows to customize
//  the types being used inside a function, class or an interface 

export { User }; 