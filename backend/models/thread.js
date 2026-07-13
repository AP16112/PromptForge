// Here we will create the schemas for message and Thread  & then also create the model for Thread.

// Here in this file, we will define the schema for models using Mongoose. This schema will outline the structure of the data that will be stored in the MongoDB database.

// Here this 'Schema' is a constructor function provided by Mongoose that allows us to define the structure of our data. We will use this to create a new schema for our messages and Thread, specifying the fields and their data types, as well as any validation rules or default values that we want to enforce.
const { Schema, mongoose } = require('mongoose');
// But to use mongoose here, we firstly need to install it :- npm install mongoose


// Define the messageSchema
const messageSchema = new Schema({
    role: {
        type: String,
        // the keyword enum is a Mongoose schema validator that restricts the allowed values for a fie
        // SO If we try to save "admin" or "system", Mongoose will throw a validation error.
        // As here we only need two roles :- user i.e us which gives the input prompt, and assistant i.e the model as the assistant which will return the response as per our request
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,    
        // default: Date.now()      // not the correct way
        default: Date.now,      // correct way
        // Date.now() → Executes immediately when the schema is defined, so all documents would get the same timestamp (the time the app started).
        // Date.now (without parentheses) → Passes the function reference, so Mongoose calls it each time a new document is created.
        // So, This is the correct way to ensure each document gets its own creation time.
    }
});



// Define the threadSchema
const threadSchema = new Schema({
    threadId: {    // A unique identifier for the thread (conversation).
        type: String,
        required: true,
        unique: true    // no two threads can share the same ID in the database.
    },
    title: {
        // A human‑friendly label for the thread. Defaults to "New Chat" if the user doesn’t provide one.
        // Useful for displaying in a chat history list (like “Resume Help” or “Travel Planning”).
        type: String,
        default: "New Thread Chat"
    },
    // An array of messageSchema objects.
    // Each message contains fields like role (user or assistant) and content.
    // This is how you store the actual back‑and‑forth conversation inside the thread.
    // It means that the messages field is an array of documents, and each document inside that array must follow the structure defined in messageSchema.
    messages: [messageSchema],
    createdAt: {
        type: Date,    
        default: Date.now,  
    },
    // here we will use this 'updatedAt' to find this Thread is recently updated so that we can so that Thread at the top in chat history component in frontend.
    // SO in Chat history component, we will show the chat history from most recent to least recent order.
    updatedAt: {
        type: Date,    
        // default: Date.now()      // not the correct way
        default: Date.now,      // correct way
        // Date.now() → Executes immediately when the schema is defined, so all documents would get the same timestamp (the time the app started).
        // Date.now (without parentheses) → Passes the function reference, so Mongoose calls it each time a new document is created.
        // So, This is the correct way to ensure each document gets its own creation time.
    }
});



// We generally take the name of model same as the name of the collection
const Thread = mongoose.model("Thread", threadSchema);

// here this "Thread" in mongoose.model("Thread", threadSchema); is actually the name of the collection
// Generally we starts the name of collection with capital letters

// SO now when to run this thread.js now, mongoDB will create a collection called as 'threads' as we pass "Thread" as collection here
// So similarly if we pass 'Product' here, then collection created will be 'products'
// And if we pass 'Employee' here, then collection created will be 'employees'

// SO that's why it's important to carefully select this name & we should not pass some plural name as inside mongoDB, it automatically gets converted to plural to be set as collection name

// it will create the 'employees' as collection
// const Employee = mongoose.model("Employee", userSchema);


// Now we will export the ThreadModel so that it can be used in other parts of our application. 
module.exports = Thread;


