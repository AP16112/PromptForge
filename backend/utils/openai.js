// SO in this utils folder, we will write the core logic of our backend like the main fn used to get response from the OpenAi or Groq API endpoints.
// Here in this file, we will create a utility function which is actually used inside the route or endpoints which is used to send the input prompt  get the result as response

if(process.env.NODE_ENV !== "production"){  
    require('dotenv').config() // or import 'dotenv/config' if you're using ES6
}
// So all the environment variables that we have defined in our .env file will be available in our application through process.env object, and we can access them using process.env.KEY_NAME where KEY_NAME is the name of the environment variable that we want to access. For example, if we have an environment variable called SECRET in our .env file, we can access its value in our application using process.env.SECRET. This allows us to keep sensitive information like API keys, database credentials, and other configuration details out of our source code and easily manage them through environment variables.



const getGroqAPIResponse =  async (message) => {
    // Build the options object that will be used to make a request to the OpenAI (or Groq) API.
    const options = {
        method: "POST",    // HTTP method is POST because we are sending data to the API.
        headers: {
            "Content-Type": "application/json",    // Tells the API we are sending JSON data.

            // Authorization header: includes your API key for authentication.
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },

        // The body is the actual payload we send to the API.
        // It must be converted to a JSON string using JSON.stringify().
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            // The messages array defines the conversation context.
            // Each message has a role ("system", "user", "assistant") and content.
            messages: [{
                role: "user",
                content: message    // The actual text comes from the request body.
                // Example: if the client sends { "message": "Hello AI" }, then content will be "Hello AI".
            }]
        })
    };

    try {
        // Send a POST request to the Groq API endpoint for chat completions.
        // 'options' contains the headers (API key, content type) and body (model + messages).
        // Here we are using fetch, but if we want we cal also use axios.
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        
        // The API returns a Response object. To read the actual JSON data, we call .json().
        // This is asynchronous, so we use await again.
        const data = await response.json();
        // console.log(data.choices);
        // console.log(data.choices[0].message.content); //reply
        
        // The OpenAI API returns an object with a 'choices' array.
        // Each choice contains a 'message' with 'role' and 'content'.
        // Here we’re extracting the assistant’s reply text from the first choice.
        // Example: data.choices[0].message.content → "Here’s a computer science joke..."
        // we send it back to the client as the HTTP response.
        return data.choices[0].message.content;
    } catch(err) {
        // If anything goes wrong (network error, invalid API key, bad request),
        // the error is caught here. We log it so you can debug.
        console.log(err);
    }
};


// Now we will export this fn to used it in routes folder.
module.exports = getGroqAPIResponse;

