// Here we are creating this 'Chat' component to be used in the frontend of this project.


import "./Chat.css";

// useContext :- A React hook for consuming context values.
// It allows us to access data/functions provided by a Context.Provider without prop drilling.
import { useState, useContext, useEffect } from "react";
// useContext :- Allows you to access values from a React Context (shared data across components without prop drilling).
// Example: const theme = useContext(ThemeContext);
// useEffect :- Runs side effects in your component (like fetching data, subscribing to events, or updating the DOM).

import { MyContext } from "./MyContext.jsx";
// MyContext → This is a context we created in MyContext.jsx using React.createContext().
// { MyContext } → The curly braces mean we’re importing a named export (not the default export) from that file.


// Now the reply which we got from Groq model or any AI model will not be properly formatted.
// So for properly formatting the reply which we got from Groq model, we will make use of these 2 packages :-
// 1. react-markdown   ---> it is used for converting the reply to proper markdown format & then display in that markdown format
// But to use this, we need to install : npm install react-markdown 
// 2. rehype-highlight  ---> it is used for syntax highlighting
// But to use this, we need to install : npm install rehype-highlight

// Import the ReactMarkdown component, it means that this is actually a component
// ReactMarkdown is a library that lets you render Markdown text (like **bold**, *italic*, lists, code blocks) directly into React components. Instead of manually parsing Markdown, you can pass a string and it will output proper HTML elements inside your React app.
import ReactMarkdown from "react-markdown";
// So it Converts Markdown text into React-rendered HTML.

// Import the rehypeHighlight plugin, it means that it is not a component but a plugin
// rehype-highlight is a plugin that integrates with ReactMarkdown to automatically add syntax highlighting to code blocks inside your Markdown. For example, if your Markdown contains ```js ... ```,
// rehype-highlight will detect the language and apply color styles to make the code easier to read.
import rehypeHighlight from "rehype-highlight";
// So it Enhances ReactMarkdown by highlighting code blocks with colors and styles.

// Here we are importing a CSS theme file for syntax highlighting
import "highlight.js/styles/github-dark.css";
// highlight.js :- A popular JavaScript library for syntax highlighting code blocks. It comes with many prebuilt themes (light, dark, colorful, etc.).

// styles/github-dark.css :- This is one of the built‑in CSS themes provided by highlight.js. It mimics GitHub’s dark mode styling for code blocks.
// When applied, any code highlighted by rehype-highlight (or directly by highlight.js) will use this dark theme.

// Why import works here :-
// In React (with bundlers like Vite, Webpack, or CRA), you can import CSS files directly into your component or entry file. This ensures the styles are bundled and applied globally.



export default function Chat() {
    // Here we are using React Context + destructuring to pull out multiple values from your MyContext provider
    const {newChat, prevChats, reply} = useContext(MyContext);
    // useContext(MyContext) :- Reads the current value of MyContext.
    // Whatever we passed into <MyContext.Provider value={...}> higher up in your component tree becomes available here.

    const [latestReply, setLatestReply] = useState(null);


    return ( 
        <>
            {/* So if this newCHat state variable is true, it means that user created a new chat i.e new Thread actually, then we will show this line */}
            {/* If user complete any sequence of prompt & response i.e 1 chat, we will make this newChat as false because then this thread or chat will not remains the just newly created thread or chat 
            SO then this message will not get displayed & in place of this, some previous messages will be displayed on output.*/}
            {newChat && <h1>Start a New Chat!</h1>}

            <div className="chats">
                {/* Now we will firstly display all the previous chats except this lastely added chat here if they exists */}
                {/* If user currently also perform prompt + response sequence, then that curr chat will get added as the last chat in this curr thread actually */}
                {/* So then we will show the reply of that that with typing effect but if in this curr thread, user currently do not add any new prompt + response sequence, then we will simply show the reply of last chat without any typing effect */}
                {/* so that's why we need to check whether the lastely added chat is curr chat or not, so that's why we will shpw that separately & that's why we are only showing all the prev chats here except the lastely added chat */}
                {/* prevChats is an array of chat objects (user + assistant messages).
                The ?. is optional chaining → prevents errors if prevChats is null or undefined. 
                The ?. ensures that if prevChats is null or undefined, the code won’t throw an error. Instead, it will short‑circuit and return undefined, so .map(...) won’t run.
                This is safer if there’s any chance that prevChats hasn’t been initialized yet.
                Because Without Optional Chaining like prevChats.slice(0, -1).map(...) :- Assumes prevChats is always defined (e.g., initialized as an empty array [] in state).
                If prevChats is null or undefined, this will throw a runtime error: “Cannot read properties of undefined (reading 'slice')”.*/}
                {/* .slice(0, -1) → takes all elements of the array except the last one. Example: [a, b, c].slice(0, -1) → [a, b].*/}
                {/* .map((chat, idx) => (...)) --> Loops through each chat object in the sliced array.
                chat → the current chat object. And idx → the index of that chat in the array (used as a React key). */}
                {
                    prevChats?.map((chat, idx) => (
                        <div className={chat.role === "user" ? "userDiv" : "groqDiv"}  key={idx}>
                            {
                                chat.role == "user" ? <p className="userMessage">{chat.content}</p> :
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                                // <ReactMarkdown> :- A React component from the react-markdown library. It takes a string of Markdown text and renders it as proper HTML inside your React app. Example: if chat.content = "**Hello**", it will render <strong>Hello</strong>.
                                // rehypePlugins={[rehypeHighlight]} :- This attaches the rehype-highlight plugin to ReactMarkdown. It automatically detects code blocks in the Markdown (like js ...) and applies syntax highlighting. That means our code snippets will be color‑styled for readability.
                            }
                        </div>
                    ))
                }


                {/* Now we will display this lastely added chat (which can be the curr chat also) */}
                {/* If user currently also perform prompt + response sequence, then that curr chat will get added as the last chat in this curr thread actually */}
                {/* So then we will show the reply of that that with typing effect but if in this curr thread, user currently do not add any new prompt + response sequence, then we will simply show the reply of last chat without any typing effect */}
                {/* so that's why we need to check whether the lastely added chat is curr chat or not, so that's why we will shpw that separately & that's why we are only showing all the prev chats here except the lastely added chat */}
                {/* Here we are checking whether user have done any chat or not using prevChats.length > 0, because if not, then nothing to show, so we will not do anything then */}
                {/* {
                    prevChats.length > 0 && (
                        <> 
                            {
                                latestReply === null ? (
                                    <div className="groqDiv"  key={"non-typing"}>
                                        <></>
                                    </div>
                                ) : (
                                    <div className="groqDiv"  key={"typing"}>
                                        <></>
                                    </div>
                                )
                            }
                        </>
                    )
                } */}
            </div>
        </>
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


