// Here we will create the user schema & its model actually.

// Here in this file, we will define the schema for models using Mongoose. This schema will outline the structure of the data that will be stored in the MongoDB database.

const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose').default;

// In Mongoose, creating new models means creating new collections.

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    errorMessages: {
        MissingUsernameError: 'Email is required.',
        MissingPasswordError: 'Password is required.',
        UserExistsError: 'A user with the given email is already registered.',
    },
});

// Now we will create the user model here
// So by-default mongoose will create a collection called as 'users' for this model
const User = mongoose.model('User', userSchema);

module.exports = User;


// Configuring Strategy :- i.e how can we apply some basic settings 

// passport.initialize() :-  
// A middleware that initializes passport
// passport.session() :- 
// A web application needs the ability to identify users as they browse from page to page.
// This series of requests and responses, each associated with the same user, is known as a session.
// passport.use(new LocalStrategy( User.authenticate() ))

// So internally, pbkdf2 hashing algorithm is used in passport.
