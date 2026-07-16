// This will be our main backend file for this project.

//-------------------------------------------------------------------------------------
// Project :- PromptForge - "Smart AI Assistant"

// A full-stack MERN AI chat application that leverages OpenAI APIs to transform user prompts into intelligent, personalized, and context-aware responses.
//-------------------------------------------------------------------------------------


// Here we firstly need to initialize :- npm init -y
// It is to create a package.json file in our project folder. 

// Then we need to install all the other required dependencies like :- 
// npm install nodemon
// npm install express 
// npm install mongoose              // It is a package which is used to connect our backend server with MongoDB database. It will help us to perform CRUD operations on our MongoDB database. It will help us to create, read, update and delete the data from our MongoDB database. It will help us to define the schema for our data and also it will help us to validate the data before saving it to the database. It will help us to create models for our data and also it will help us to perform queries on our data. It will help us to create relationships between different collections in our database. It will help us to create indexes on our data for faster queries. It will help us to create middleware for our data for pre and post processing of data. It will help us to create virtuals for our data for computed properties. It will help us to create plugins for our data for reusable functionality. It will help us to create transactions for our data for atomic operations. It will help us to create aggregation pipelines for our data for complex queries. It will help us to create population for our data for referencing other documents in our collections.

// npm install cors                // it will be used to enable Cross-Origin Resource Sharing (CORS) in our Express application. It will help us to allow or restrict the resources on our server to be requested from another domain outside the domain from which the resource originated. It will help us to handle the cross-origin requests and responses in our application.
// As our React frontend application is in different folder or URL and our backend server is in different folder or URL, so when we make a request from our React application to our backend server, it will be considered as a cross-origin request. So we need to enable CORS in our backend server to allow the requests from our React application.
// SO cors is used to establish connections between different domains or ports. It is a security feature implemented by web browsers to prevent malicious websites from making requests to a different domain without the user's consent. It allows us to specify which domains are allowed to access our server's resources and which HTTP methods are permitted for those requests. It helps us to control the access to our server's resources and protect our application from potential security risks.

// npm install dotenv                 // it will be used to load environment variables from a .env file into process.env. It will help us to manage the configuration settings of our application in a separate file and keep them secure. It will help us to access the environment variables in our application and use them for different purposes like database connection, API keys, etc.


// Once environmental variables gets saved in .env file, then we can use them anywhere in our project.
// But we can't use these environment variables directly in our code, we need to load them into our application using the dotenv package. To do that, we need to require the dotenv package and call the config() method at the very beginning of our application (usually in the index.js file) before any other code that uses environment variables. This will load the environment variables from the .env file into process.env, allowing us to access them throughout our application using process.env.KEY_NAME.
// This 'process' is actually used to track all the processes running in our operating system. It is a global object that provides information about the current Node.js process and allows us to interact with it. It provides various properties and methods that we can use to access information about the process, such as its ID, version, platform, memory usage, environment variables, and more. It also allows us to handle events related to the process, such as exit events, uncaught exceptions, and signals. We can use the process object to control the behavior of our Node.js application and manage its lifecycle.
// here we are using this condition to check that if our application is not running in production environment, then we will load the environment variables from the .env file using dotenv package. This is a common practice to ensure that we only load the .env file during development and testing, and not in production where environment variables are typically set through other means (like hosting platform settings or CI/CD pipelines). By doing this, we can keep our production environment secure and avoid accidentally exposing sensitive information from the .env file.
if(process.env.NODE_ENV !== "production"){  
    require('dotenv').config() // or import 'dotenv/config' if you're using ES6
}
// So all the environment variables that we have defined in our .env file will be available in our application through process.env object, and we can access them using process.env.KEY_NAME where KEY_NAME is the name of the environment variable that we want to access. For example, if we have an environment variable called SECRET in our .env file, we can access its value in our application using process.env.SECRET. This allows us to keep sensitive information like API keys, database credentials, and other configuration details out of our source code and easily manage them through environment variables.


//This express is actually a function here
const express = require("express");
//And we store the value return by this express() fn in a variable called app
//We generally by convention take the name of variable as app, but we can take any name also
const app = express();
//Now this 'app' will help us to create the server side web application
//This 'app' is actually the object
// SO now this 'app' object actually represents our express application and we can use it to configure our application, define routes, handle requests and responses, and manage middleware. 
// It provides a set of methods and properties that allow us to build a web server and handle HTTP requests and responses in a structured way. We can use this 'app' object to define the behavior of our application and create a server that listens for incoming requests on a specified port.

const cors = require("cors");


// this express-session is actually a middleware, so we will make use of app.use() here
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
// Here this local strategy we are going to follow actually.

const MongoStore = require("connect-mongo");


// Here we are defining the port number on which our backend server will run. We are using the environment variable PORT if it is defined, otherwise we are using the default port number 8080. This allows us to easily change the port number in different environments (e.g., development, production) without having to modify the code. It also allows us to avoid conflicts with other applications that may be using the same port number.
const port = process.env.PORT || 8080;

// Now we will reuire 'router' object from the 'chat.js' file from the routes folder here, so that we can use that router object here directly 
const chatRoutes = require("./routes/chat.js");
const authRoutes = require("./routes/auth.js");
// Now here this 'chatRoutes' actually representing the router object having all the routes like router.get() or router.post() or etc.

const mongoose = require("mongoose");
// mongoose is a library that creates a connection between MongoDB & Node.js JavaScript Runtime Environment.

const User = require("./models/user.js");


// SO now we will use the app.use() method to add middleware to our Express application. Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. They can execute any code, make changes to the request and response objects, end the request-response cycle, and call the next middleware function in the stack. In this case, we are using two middleware functions: cors() and bodyParser.json(). The cors() middleware enables Cross-Origin Resource Sharing (CORS) for all routes, allowing our frontend application to make requests to our backend server from a different domain or port. The bodyParser.json() middleware parses incoming request bodies in JSON format and makes them available under the req.body property, allowing us to easily access and process data sent from the client side.
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true   // For cookie/session auth, this must allow credentials
}));// Enable CORS for all routes
// CORS (Cross-Origin Resource Sharing) is a security feature built into browsers. By default, browsers block requests from one origin (say, http://localhost:3000) to another (http://localhost:8080).
// cors() is a middleware that tells Express: “It’s okay to accept requests from other origins.”
// With app.use(cors());, you’re enabling CORS for all routes in your server.
// This is essential when your frontend (React, Angular, etc.) runs on a different port/domain than your backend API.


//SO this is a standard line which we use always whenever we use the POST request
//Here app.use() means that this work must happens for all requests
//SO it means if for any post request, then express will parse it to understand it
app.use(express.json()); // for JSON data
//SO it means if for any post request, json data comes, then express will parse it to understand it


const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,   // so now all our session info gets stored in MongoDb Altas store.
    // Here we are passing the secret in this MongoStore.create() method also because we are using this store to store our session data in the database, so we need to pass the secret here also to make the session cookie as signed cookie.
    
    //Here by this touchAfter option, we are setting the time period after which the session data will get updated in the database, so that it will not update the session data in the database for every request, it will only update the session data in the database after this time period, so that it will reduce the number of writes to the database and improve the performance of our application.
    // Normally, every time a user makes a request, the session store updates the session document in MongoDB.
    // This can cause a lot of writes to your database, even if the session data hasn’t changed.
    // touchAfter sets a minimum time interval (in seconds) before the session is “touched” (updated) again.
    // If the session hasn’t changed, but the user keeps making requests, MongoDB won’t be updated until that interval passes.
    touchAfter: 24 * 60 * 60 // time period in seconds
    // Here, the session will only be updated in MongoDB once per day if the session data hasn’t changed.
    // If you modify the session (e.g., add/remove data), it will still be saved immediately.
    // This reduces unnecessary writes and improves performance.
});
// So here we are creating a new MongoDB store for our sessions using connect-mongo. This will allow us to store session data in our MongoDB database instead of in memory, which is more scalable and suitable for production environments. We pass the mongoUrl option with our database URL to connect to the correct MongoDB instance.



const sessionOptions = {
    // store: store,   // here we are passing the store that we created above to store our session data in the database, so that it will be more secure and scalable than storing the session data in memory.
    store,     // here we are passing the store that we created above to store our session data in the database, so that it will be more secure and scalable than storing the session data in memory.
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    //cookie → This object defines settings for the session cookie that gets sent to the browser.
    // expires → Sets the exact date/time when the cookie should expire.
    // Date.now() → Returns the current timestamp in milliseconds. 7 * 24 * 60 * 60 * 1000 → Number of milliseconds in 7 days:
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
}
// This is the secret used to sign the session ID cookie.
// The secret itself should be not easily parsed by a human and would best be a random set of characters. A best practice may include:
// The use of environment variables to store the secret, ensuring the secret itself does not exist in your repository.
// Periodic updates of the secret, while ensuring the previous secret is in the array.

// But for easiness we are taking a simple string as secret here.
// so the cookie which we are sending to browser which containing sessionId is actually a signed cookie.
// so we need to make use of sceret to make this as signed cookie i.e to add signature to this cookie. 

// So now as we use our session as middleware & also added a secret in it, so now with any request i.e app.get() or post() or etc,  a sessionId will get stored inside our browser in the form of a cookie.

// resave :- Forces the session to be saved back to the session store, even if the session was never modified during the request.



app.use(session(sessionOptions));


// We need the session to make use of passport because within one session, user credentials remains the same
// So we need to use this passport below this app.use(session(sessionOptions)) only.

app.use(passport.initialize());
// This sets up Passport so it can intercept requests and look for authentication data. Without it, Passport’s strategies (like local login) won’t run.
app.use(passport.session());
// So we use this so that each request must know of what session they are actually a part of.
// This hooks Passport into Express’s session middleware. It ensures that once a user is authenticated, their session ID is stored in a cookie. On subsequent requests, Passport can deserialize the user from the session and attach the user object to req.user.


// use passport-local-mongoose helpers for local strategy/session support
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.serializeUser(User.serializeUser());
// Purpose: Defines how user data is stored in the session. When a user logs in successfully, Passport needs to "serialize" the user — i.e., decide what piece of information should be saved in the session cookie.
// By default, passport-local-mongoose provides a helper method User.serializeUser() that tells Passport to store the user’s unique identifier (usually _id) in the session.
// This keeps the session lightweight — instead of storing the whole user object, only the ID is stored.
// e.g User logs in with username + password. Passport verifies credentials.
// serializeUser runs → stores user._id in the session cookie. The browser now carries this session ID with each request.

// passport.deserializeUser(User.deserializeUser());
// Purpose: Defines how to retrieve full user details from the session. When a request comes in, Passport looks at the session cookie, finds the stored user ID, and then "deserializes" it — i.e., fetches the full user object from the database.
// User.deserializeUser() is a helper from passport-local-mongoose that knows how to look up the user by ID and attach it to req.user.
// e.g Browser sends a request with the session cookie. Passport extracts the stored user._id.
// deserializeUser runs → queries MongoDB for that user. The complete user object is attached to req.user, so you can access it in your routes.




// There are two ways in which we can use the OpenAI APIs :-
// 1. Using the openai npm package :-
// In this, we can use the openai model to get some response.
// SO for this we need to install : npm install openai

// But here instead of using openAi GPT models APIs for which we need to purchase some credits, we will use Groq APIs as they are completely free.
// This is actually the boilerplate available in OpenAI docs.
// const OpenAI = require('openai');

// const client = new OpenAI({
//     apiKey: process.env.GROQ_API_KEY, // This is the default and can be omitted
//     baseURL: "https://api.groq.com/openai/v1",
// });

// async function run() {
//     const response = await client.responses.create({
//         model: "llama-3.1-8b-instant",
//         input: 'Joke related to Computer Science',
//     });

//     console.log(response.output_text);
// }
// run();



// 2. By Openai APIs calls :-
// In this we can use fetch or axios to apply api calls to different endpoints of openai based on model to get some response.

// Here we can use any of these i.e fetch or axios.

// SO here we will use Groq chat completions endpoints which are OpenAI‑compatible API endpoints actually, for this project.

// Here we will create this route or endpoints i.e '.../test' to pass a POST request to this chat completions endpoints to get some response.
// Here as we sending post request to groq model, which can take same time also, so that't why we are taking this as async
// Declaring a function as async allows you to use the await keyword inside it.
// await pauses execution of that function until the asynchronous operation (like fetch) finishes, but without blocking the entire server.
// app.post("/test", async (req, res) => {
//     // Build the options object that will be used to make a request to the OpenAI (or Groq) API.
//     const options = {
//         method: "POST",    // HTTP method is POST because we are sending data to the API.
//         headers: {
//             "Content-Type": "application/json",    // Tells the API we are sending JSON data.

//             // Authorization header: includes your API key for authentication.
//             "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//         },

//         // The body is the actual payload we send to the API.
//         // It must be converted to a JSON string using JSON.stringify().
//         body: JSON.stringify({
//             model: "llama-3.1-8b-instant",
//             // The messages array defines the conversation context.
//             // Each message has a role ("system", "user", "assistant") and content.
//             messages: [{
//                 role: "user",
//                 content: req.body.message    // The actual text comes from the request body.
//                 // Example: if the client sends { "message": "Hello AI" }, then content will be "Hello AI".
//             }]
//         })
//     };

//     try {
//         // Send a POST request to the Groq API endpoint for chat completions.
//         // 'options' contains the headers (API key, content type) and body (model + messages).
//         // Here we are using fetch, but if we want we cal also use axios.
//         const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        
//         // The API returns a Response object. To read the actual JSON data, we call .json().
//         // This is asynchronous, so we use await again.
//         const data = await response.json();
//         // console.log(data.choices);
//         // console.log(data.choices[0].message.content); //reply
        
//         // The OpenAI API returns an object with a 'choices' array.
//         // Each choice contains a 'message' with 'role' and 'content'.
//         // Here we’re extracting the assistant’s reply text from the first choice.
//         // Example: data.choices[0].message.content → "Here’s a computer science joke..."
//         // we send it back to the client as the HTTP response.
//         res.send(data.choices[0].message.content);
//     } catch(err) {
//         // If anything goes wrong (network error, invalid API key, bad request),
//         // the error is caught here. We log it so you can debug.
//         console.log(err);
//     }
// });






// Here this process.env.ATLASDB_URL is the URL of our Atlas MongoDB database, which is running on cloud i.e on MongoDB Atlas.
const dbUrl = process.env.ATLASDB_URL;
// Here this dbUrl is the URL of our MongoDB database, which is running on cloud i.e on MongoDB Atlas. We are storing this URL in an environment variable called ATLAS_URL in our .env file for security reasons, so that we can easily manage it and keep it secure. We can access this environment variable in our application using process.env.ATLAS_URL.
// So here we will use this dbUrl to connect to our MongoDB database using mongoose.connect() method.

// Here this .connect() fn of mongoose is used to connect to mongoDB server

// Here As soon as we run this 'mongoose.connect(dbUrl);' command, it will actually awaits for a promise from the database itself.
// Here this .connect() method is a asynchronous method, so it will start a asynchronous process
// So most of the proccess that we will perform using mongoose will actually be asynchronous processes because sometimes it takes time to gets the response from the database, so it is necessary for these processes to be asynchronous
// SO we will handle all these functions asynchronously only.
// SO that's why we will use this way :-
// As we know that An async function always returns a Promise, here also it will return a promise
// What is happening here? :-
// mongoose.connect() is asynchronous. So, it returns a Promise
// await:
// pauses execution inside main()
// waits until MongoDB connection is done
// If connection succeeds → move on & print 'connected to DB successfully'
// If connection fails → throw an error

// connectDB().then(() => {
//     console.log("connected to DB successfully");
// })
// .catch((error) => {
//     console.log(error);
// });

// async function connectDB() {
//     await mongoose.connect(dbUrl);
// }
//-----------OR-------------
const connectDB = async() => {
    try {
        await mongoose.connect(dbUrl);

        console.log("connected to DB successfully");
    } catch(error){
        console.log(error);
    }
}
// And we can call this fn from inside the app.listen() actually.



//Now here this 'chatRoutes' actually representing the router object having all the routes like router.get() or router.post() or etc.
// app.use("/", chatRoutes) → Tells Express: “For any request starting with /, hand it over to the chat router.”
// But we generally take some common starting path here in app.use() like '/api' which comes in all the chat routes.
// So now all the paths in router chat.js file, will starts after the '/api'
app.use("/api", chatRoutes);
// Organized routes: All routes inside the listings router will automatically be prefixed with /api.
// Avoids repetition: You don’t have to write /api in every route definition inside the router file.
// Clear structure: Makes it obvious that these routes belong to the “ChatRoutes” resource.
// here this '/api' is parent route & all the route that will be present after this in chat.js  router.get() or router.post() will be child route.

app.use("/api/auth", authRoutes);
// Organized routes: Auth routes are available under /api/auth, and chat routes remain under /api.



//this .listen() fn have two parameters & the 1st parameter is 'port' & end parameter is some callback fn
//.listen actually creates a web server which listens for incoming API requests
app.listen(port, () => {
    console.log(`app(i.e server) is listening to port ${port}`);

    connectDB();    // it will connect us with the MongoDB
});  //So it will starts the server which continuously listens for API requests


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// SO to run this backend server, we will use the command :-
// nodemon server.js
//------OR------
// node server.js






//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// OpenAI APIs :-
// There are two ways in which we can use the OpenAI APIs :
// 1. Using the openai npm package 
// In this, we can use the openai model to get some response.
// SO for this we need to install : npm install openai

// 2. By Openai APIs calls
// In this we can use fetch or axios to apply api calls to different endpoints of openai based on model to get some response.

// Here we will try to see how both ways works.
// Here we will see how this 1st way works as a demo.
// But we will actually use this 2nd way for this project.


// But here instead of using openAi GPT models APIs for which we need to purchase some credits, we will use Groq APIs as they are completely free.

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Thread in database :-
// Here in database, we will store the history of chats actually.
// We will consider groups of chats which happens in one complete interaction as as 1 thread actually. 
// SO A thread in the context of storing chat history is simply a grouping of messages that belong to one continuous conversation or interaction.

// Message: A single entry in the chat (user or assistant).
// Thread: A collection of related messages that together form one “session” of conversation.
// Example: You ask a question, get an answer, ask a follow‑up, and get another answer — all of those belong to the same thread.
// When you start a completely new topic or session, that becomes a new thread.

// So in database, we will actually store these threads i.e 1 thread as one entry & not messages


