// Here we are creating this 'ChatWindow' component to be used in the frontend of this project.


import "./ChatWindow.css";

import Chat from "./Chat.jsx";

// useContext :-
// A React hook for consuming context values.
// It allows us to access data/functions provided by a Context.Provider without prop drilling.
import { useState, useContext, useEffect } from "react";
// useContext :- Allows you to access values from a React Context (shared data across components without prop drilling).
// Example: const theme = useContext(ThemeContext);
// useEffect :- Runs side effects in your component (like fetching data, subscribing to events, or updating the DOM).

import { MyContext } from "./MyContext.jsx";
// MyContext → This is a context we created in MyContext.jsx using React.createContext().
// { MyContext } → The curly braces mean we’re importing a named export (not the default export) from that file.



export default function ChatWindow() {
    // Here we are using React Context + destructuring to pull out multiple values from your MyContext provider
    const {prompt, setPrompt, reply, setReply, currThreadId} = useContext(MyContext);
    // useContext(MyContext) :- Reads the current value of MyContext.
    // Whatever we passed into <MyContext.Provider value={...}> higher up in your component tree becomes available here.

    // SO, every thread will get a UUID even though we don’t explicitly call setCurrThreadId inside our ChatWindow component.
    // Because here we are initializing this currThreadId with uuid(), so that means: as soon as the provider mounts, React runs useState(uuidv4()).
    // uuidv4() is executed immediately. A fresh unique ID is generated. That ID becomes the initial state value for currThreadId.
    // Because React state persists across re-renders, that UUID stays the same for the lifetime of the component i.e particular thread (until you explicitly call setCurrThreadId).
    // We don’t need to call setCurrThreadId unless we want to reset or start a new thread.
    // The initial call to useState(uuidv4()) already guarantees that currThreadId has a valid unique ID from the very beginning.
    // So even without calling the setter, every thread starts with a UUID automatically.
    // Each thread gets a UUID automatically because uuidv4() is executed once when the state is initialized. We don’t need to call setCurrThreadId unless we want to deliberately change it later.



    // Here it is an async function because here we will apply the post request to '/chat' route of backend using fetch fn
    // And that will get the response from Groq model which can be time consuming, so that's why we need this to be a async function
    const getReply = async () => {

        console.log("Current threadId : ", currThreadId);
        console.log("Curr message : ", prompt);

        // Build the options object that will be used to make a request to '/chat' route of backend using fetch fn
        const options = {
            method: "POST",    // HTTP method is POST because we are sending data to the API.
            headers: {
                "Content-Type": "application/json",    // Tells the API we are sending JSON data.
            },

            // The body is the actual payload we send to the API.
            // It must be converted to a JSON string using JSON.stringify().
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };
        // SO this options will became the blueprint for the HTTP request on the client i.e in backend.

        try {
            // Send a POST request to the '/chat' route of backend.
            // 'options' contains the headers (API key, content type) and body (model + messages).
            // Here we are using fetch, but if we want we cal also use axios.
            const response = await fetch("http://localhost:8080/api/chat", options);
            
            // This will returns a Response object. To read the actual JSON data, we call .json().
            // This is asynchronous, so we use await again.
            const res = await response.json();
            // Here it will return the object in which 'reply' key contains the actuall reply message as its value
          
            console.log(res);

            setReply(res.reply);
        } catch(err) {
            // If anything goes wrong (network error, invalid API key, bad request),
            // the error is caught here. We log it so you can debug.
            console.log(err);
        }
    }
    

    return ( 
        <div className="chatWindow">
            <div className="navbar">
                <span>PromptForge <i className="fa-solid fa-chevron-down"></i></span>

                <div className="userIconDiv">
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {/* Here we will render this Chat component to display all the chats or threads */}
            <Chat/>

            {/* Chat input section for taking the user input prompt*/}
            <div className="chatInput">
                <div className="inputBox">
                    <input 
                        placeholder="Ask anything"  
                        value={prompt}     // The value of the input is controlled by the React state variable 'prompt'. This makes it a "controlled component" (React manages the value).
                        onChange={(event) => setPrompt(event.target.value)}     // Event handler: runs whenever the user types in the input. 'event.target.value' is the new text the user entered. 'setPrompt' updates the state with that new value.
                        onKeyDown={(event) => event.key === 'Enter' ? getReply() : ''}
                        // onKeyDown → A React event handler that fires whenever a key is pressed down while the input is focused
                        // event.key → A property that tells you which key was pressed (e.g., "Enter", "a", "Backspace").
                        // SO here If the key pressed is "Enter": Call the function getReply() (likely your async function that fetches a reply).
                        // Otherwise: '' it means that Do nothing ('' is just a placeholder here).
                    ></input>
                    {/* So we will get the output either when we click on this button having id="submit" or when we simply click enter while inside this input element area */}
                
                    <div id="submit"  onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>

                <p className="info">PromptForge can make mistakes. Check important info. See Cookie Preferences.</p>
            </div>
        </div>
    );
}




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Hooks :-
// Hooks were a new addition in React 16.8.
// They let you use state and other React features without writing a class.
// There are currently 15 hooks in react.
// e.g useState() is one of the hook.

// So hook is a function that helps to deal with states.

// React Hooks are special functions that let you use React features (like state, lifecycle methods, and context) inside functional components, without needing class components. They make components more powerful, reusable, and easier to manage.

// What Hooks Do :-
// Enable state in functional components (useState, useReducer).
// Handle side effects like data fetching or subscriptions (useEffect).
// Access context values without prop drilling (useContext).
// Work with DOM elements or mutable values (useRef).
// Optimize performance (useMemo, useCallback).
// Provide advanced features like transitions (useTransition) or custom hooks.

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// useState() :-
// useState is a React Hook that lets you add a state variable to your component.
// state variable means those variable in which when any changes occurs, then component needs to re-renders.
// e.g const [state, setState] = useState(initialState);

// So to use useState, we need to pass a initila value.
// e.g here if we want counter to be state variable, then initialState will be its initial value i.e 0

// useState returns an array with exactly two values :-
// 1. The current state. During the first render, it will match the initialState you have passed.
// 2. The set function that lets you update the state to a different value and trigger a re-render.

// This setState method is also called as updater function as it updates the state variable.

// initialState: The value you want the state to be initially. It can be a value of any type, but there is a special behavior for functions. This argument is ignored after the initial render.

// We can only create the state variable inside some component & not outside it.
// If we want we can also create multiple state variables inside the same component also.


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// useEffect() :-
// It is also an Hook in React.
// The Effect Hook lets you perform side effects in function components

// When our component is rendered first time, or whenever our component is rebdered  and we want to perform some task, then we can make use of useEffect hook.
// e.g when our state variable is changing , then it means that our component gets re-renders & if before rendering we want to perform some task, then we can do that using this useEffect() hook

// Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.

// Side effects are things that happen outside the normal rendering flow, such as:-
// Fetching data from an API
// Subscribing/unsubscribing to events
// Updating the DOM manually
// Setting timers

// So we can pass some function inside useEffect like :-
// useEffect( function )
// Now whenever any changes happens in state, then this functions gets executed actually.
// SO this function is actually a side-effect here
// e.g useEffect(function printSomething() {
//     console.log("This is a side-effect");
// });

// Now we can also pass the dependencies inside this useEffect along with setup( i.e some function):-
// useEffect(setup, dependencies);
// These dependencies are nothing but our state variables.

// setup (the first argument) :-
// This is the function where you put your side effect logic.
// Example: fetching data, setting up a timer, subscribing to an event.
// It can also return a cleanup function to undo the effect when the component unmounts or before the effect re-runs.

// dependencies (the second argument) :-
// This is an array of values that React watches.
// The effect runs again whenever any of these values change.
// It controls when the effect executes.

// Examples: Empty array [] → run only once after initial render.
// No array → run after every render.
// Specific values [count] → run after initial render and whenever count changes.


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Real Life Use Cases of useEffect() :-
// e.g during 1st time rendering, before rendering our app is fetching some data from database which will take some time
// And during that time, we want that some loader must appear on screen, so we can use this useEffect to show loader using some function before our 1st time rendering.

// Similarly, we have soo many real life use cases of this useEffect which are given in React documentation.

// One of the use case is :-
// API Calls - Asynchronous Operations :-
// Asynchronous Operations like fetching data from DB or from mapbox or we are using google APIs etc.

// So here we will create this Joker component which will print some joke & in that we will use API calls & look for how useEffect will be used in that.
