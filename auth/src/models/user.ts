import mongoose, { Mongoose } from 'mongoose';

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
});

userSchema.static( 'build', (attrs : userAttrs) => {
    return new User(attrs);
})

const User = mongoose.model<userDoc, UserModel>('User',userSchema);

// <T,U> Generic Type arguments - can be considered as types being 
// provided to a function as arguments. Essentially allows to customize
//  the types being used inside a function, class or an interface 

export { User }; 