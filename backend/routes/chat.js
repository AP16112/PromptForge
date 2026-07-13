// Here in this file, we will create all our routes for this project.

//This express is actually a function here
const express = require("express");

// Now we will create our router object here
// so we will use this :- const router = express.Router();
const router = express.Router();  //Creates a new router instance.
// This router is like a mini Express app that can handle its own routes and middleware.
// It has access to all HTTP methods (get, post, put, delete, etc.), just like app does.
// So instead of writing everything in app.js with app.get() or app.post(), you define routes here with router.get() or router.post().

const Thread = require("../models/thread.js"); 
// As we know that for this Model, by-default mongoose will create a collection called as 'threads' for this model


const getGroqAPIResponse = require("../utils/openai.js");




// Test Route :- i.e route to test the main API calls to Groq API endpoints
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread"
        });

        // Here we are saving this document i.e new thread into the database 
        // SO here no need to connect with DB again as we know that now as soon as we start the server, our server.js file gets connected to DB & from that file only we will actually use these routes as as are using this Router object in server.js file actually
        const reponse = await thread.save();

        res.send(reponse);
    } catch(error){
        console.log(error);

        // .status(500) → Sets the HTTP status code of the response to 500. 500 is the standard code for Internal Server Error.
        // It signals to the client that the server encountered a problem it couldn’t handle (in this case, saving to the DB failed).
        // .json({ error: "Failed to save in DB" }) → Sends a JSON‑formatted response body back to the client.
        // The object { error: "Failed to save in DB" } is converted into JSON.
        // The client receives something like:
        // {
        //     "error": "Failed to save in DB"
        // }
        res.status(500).json({error: "Failed to save in DB"});
    }
});






// Now we will define all of our required routes for this project :-

// Get all threads Route :-
// GET  ---->  "/thread"  route  :- to get all the threads from the database in the sorted order of updatedAt time.
// So the latest updated or lastest created thread i.e most recent chat will be at top & vice-versa
router.get("/thread", async (req, res) => {
    try {
        // It will Finds all documents in the "threads" collection & return that as the array of documents
        // {} → empty filter, so it returns everything
        // .sort({ updatedAt: -1 }) → sorts results by updatedAt in descending order.
        // -1 means descending (most recent first).
        // +1 would mean ascending (oldest first).
        const threads = await Thread.find({}).sort({updatedAt: -1});
        // descending order of updatedAt... most recent data on top
    
        // Sends the array of thread documents back to the client in JSON format. so, The frontend can then render them in the chat history component.
        res.json(threads);
    } catch(error) {
        console.log(error);

        // .status(500) → Sets the HTTP status code of the response to 500. 500 is the standard code for Internal Server Error.
        // It signals to the client that the server encountered a problem it couldn’t handle (in this case, saving to the DB failed).
        // .json({ error: "Failed to fetch threads" }) → Sends a JSON‑formatted response body back to the client.
        // The object { error: "Failed to fetch threads" } is converted into JSON.
        // The client receives something like:
        // {
        //     "error": "Failed to fetch threads"
        // }
        res.status(500).json({error: "Failed to fetch threads"});
    }
});




// Get all the messages of a particular thread Route :-
// GET  ---->  "/thread/:threadId"  route  :- to get all the messages of a particular thread from the database
router.get("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;      // Extract threadId from the URL parameters

    try {
        // Find a single thread document in MongoDB that matches the given threadId
        const thread = await Thread.findOne({threadId});

        if(!thread) {
            res.status(404).json({error: "Thread not found"});
        }
    
        // If thread exists, return its messages array as JSON
        res.json(thread.messages);
    } catch(error) {
        console.log(error);

        res.status(500).json({error: "Failed to fetch this chat messages"});
    }
});





// Delete a particular thread Route :-
// DELETE  ---->  "/thread/:threadId"  route  :- to delete a particular thread from the database
router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;      // Extract threadId from the URL parameters

    try {
        // Find a single thread document in MongoDB that matches the given threadId & then delete that thread & it will also return that deleted thread actually
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread) {
            res.status(404).json({error: "Thread not found"});
        }
    
        res.status(200).json({success: "Thread deleted successfully"});
    } catch(error) {
        console.log(error);

        res.status(500).json({error: "Failed to delete thread"});
    }
});





// Main chat Route to send the prompt (message) in order to get the response :-
// POST  ---->  "/chat"  route  :- Main POST Route to send & save the prompt (message) + response in database & then also return the response as output which we get from the Groq API endpoints 
// SO when we want to send a new message or prompt in order to get the result or response, we make use of this route actually
router.post("/chat", async (req, res) => {
    // As this is post request, user inputs will not be there as request parameter but it will be present inside the body of the request
    // Extracting threadId and message from the request body 
    const {threadId, message} = req.body;    
    
    // Validation check:
    // - If threadId is missing, we don’t know which conversation to continue.
    // - If message is missing, there’s no prompt to send to the Groq API endpoint.
    // SO if any of these doesn't exists then we can't find the response
    // Because if there is no message i.e no prompt then no need to send any response as no input message or prompt is given by user
    // Also if there is no thread id, then also we can't send response as we don't know which thread we are taking about.
    // so we need both these details as input from the user.
    if(!threadId || !message){
        res.status(400).json({error: "missing required fields"});
    }

    // Now if both these details exists, then two cases possible :-
    // 1. we already have the chat or thread in database & in that only, we are continuing the new message
    // 2. we are starting the new chat or we don't have this thread in database yet & we need to create it now.
    try {
        // Try to find an existing thread in the database with this threadId
        let thread = await Thread.findOne({threadId});
        // Why let is used here :-
        // const creates a variable binding that cannot be reassigned.But we can still mutate the contents of an object or array, but we cannot point the variable to a new object.
        // let allows reassignment. In this code, we first assign thread to the result of Thread.findOne(...).
        // Then, if no thread is found, we reassign thread to a new Thread(...) object.

        // findOne() gives a document object tied to Mongoose. It’s not a detached copy; it’s connected to the underlying MongoDB record. we can mutate it and call .save() to update the DB.

        if(!thread) {
            // Case 1: No thread found → create a new one
            // So it means this is some new chat as no previous chat or thread exists for this threadId
            // create a new thread in DB
            thread = new Thread({
                threadId,    // unique identifier for this conversation
                title: message,    // using the first message as the thread title
                messages: [{role: "user", content: message}]
            });
        }else{
            // Case 2: Thread exists → append the new user message 
            // SO here we are continuing some already existing conversations only.
            thread.messages.push({role: "user", content: message});
        }

        // Call your Groq API helper function to get the assistant’s reply i.e our Groq model reply
        const assistantReply = await getGroqAPIResponse(message);

        thread.messages.push({role: "assistant", content: assistantReply});
        // Update the 'updatedAt' timestamp so this thread shows up as most recent
        thread.updatedAt = new Date();

        // Save the thread (either newly created or updated) back into the database
        // SO if this thread already exists in DB, then same thread messages array gets updated actually & not the new document will get created.
        await thread.save();
    
        // Sending the assistant’s reply back to the client to that in the frontend
        res.json({reply: assistantReply});
    } catch(error) {
        console.log(error);

        res.status(500).json({error: "something went wrong"});
    }
});
 




// Now we will export this router object, so that we can use all these router.get() or router.post() etc inside the server.js directly by creating them here instead of creating them in server.js
module.exports = router;



