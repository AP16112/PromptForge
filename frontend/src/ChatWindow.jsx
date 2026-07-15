// Here we are creating this 'ChatWindow' component to be used in the frontend of this project.


import "./ChatWindow.css";

import Chat from "./Chat.jsx";
import AuthModal from "./AuthModal.jsx";

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

// So here this 'RingLoader' is also a component actually.
import { RingLoader } from 'react-spinners';
// But to import this RingLoader, we firstly need to install :- 
// npm install react-spinners



export default function ChatWindow() {
    // Here we are using React Context + destructuring to pull out multiple values from your MyContext provider
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, isLoggedIn, setIsLoggedIn, showAuthModal, setShowAuthModal, authMode, setAuthMode} = useContext(MyContext);
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


    // SO initiallu loading will be false, it means current it is not loading the response.
    const [loading, setLoading] = useState(false);

    // Here this state variable will store whether the profile dropdown is open or not.
    const [isOpen, setIsOpen] = useState(false);


    // Here it is an async function because here we will apply the post request to '/chat' route of backend using fetch fn
    // And that will get the response from Groq model which can be time consuming, so that's why we need this to be a async function
    const getReply = async () => {
        // As as soon as this getReply fn gets called, it means that reponse is been calculated, so we need to show loader in this time
        // So we will set this loading state variable to true now.
        setLoading(true);

        // As here we are getting the response for some user prompt in this current Thread, it means that we already created this Thread or chat & now it is not new Chat or Thread
        setNewChat(false);
        // As newChat == true, when we have just created the new chat or Thread, but haven't  send 1st user prompt to get some response yet
        // But even if we have send 1 user prompt, then it means that we created this Thread or chat, so now it is not remains the new chat now as we have dome some messages in it, so we will make this newChat = false now.

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

        // So as soon as we gets the response, we will set this loading state variable to false now.
        setLoading(false);
    }


    // Append new chat (sequence of both prompt & reply messages) to prevChats as soon as we get the reply for this curr user prompt from the Groq model.
    // Here we will make use of useEffect() & as soon as this reply state variable changes we will setPrevChats 
    // This effect runs whenever 'reply' changes (see dependency array below). That means: after you get a new reply from the backend, this code executes.
    useEffect(() => {
        // We only proceed if both 'prompt' (user's message) and 'reply' (assistant's response) exist.
        // This ensures we don't accidentally add incomplete chat entries.
        if(prompt && reply) {
            // But as here new state value depends on prev state value, so we will make use of callback in updater function
            // React itself passes the latest state value into that curr prevChats argument. You don’t supply it — React does.
            // So this prevChats actually the array of all the prev chats which React will supply automatically to this prevChats variable 
            setPrevChats((prevChats) => {
                return [ 
                    // spread the existing chat history & then adding these two objects & then returning that new array of objects as prevChats now
                    ...prevChats, 
                    {
                        role: "user",
                        content: prompt
                    }, 
                    {
                        role: "assistant",
                        content: reply
                    }
                ];
            });
        }

        //As we already added this curr prompt & its response to array of chats for this curr thread, which we will store in database as array of messages for this curr thread
        // So now we will set the user prompt to "",  we already get the response for curr prompt, so "" means that if user wants he can send another prompt now.
        setPrompt("");
    }, [reply]);
    // Here 'reply' is Dependency array: this effect runs whenever 'reply' changes
    
    // So we can pass some function inside useEffect like :-
    // useEffect( function )
    // Now whenever any changes happens in state, then this functions gets executed actually.
    // SO this function is actually a side-effect here
    // useEffect(function printSomething() {
    //     console.log("This is a side-effect");
    // });
    // Now currently this useEffect is trigerring on every rendering, but if we want that it must triger only at some particular change, then we will use dependencies
    // useEffect(function printSomething() {
    //     console.log("This is a side-effect");
    // }, [countx]);    
    // So now this fn will only triger when this countx changes & not when county changes

    // But if we want that this useEffect must trigger in both cases, then we can either remove this dependencies array or can use this :-
    // useEffect(function printSomething() {
    //     console.log("This is a side-effect");
    // }, [countx, county]);
    
    // But if we pass empty array, then this useEffect will only gets trigger during 1st time rendering & will not trigerred during re-rendering
    // useEffect(function printSomething() {
    //     console.log("This is a side-effect");
    // }, []); 



    // Here we will use this handler fn to toggle this isOpen state variable i.e if it was true earlier i.e profile dropdown is open, then by clicking on the same profile icon, here we will set it to false, it close the profile dropdown actually
    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }


    // Here this fn will open the auth modal (i.e login/signup dialog) in login or signup mode.
    const openAuthModal = (mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);   // as we are opening the login/signup dialog, so we will set this to true now
        setIsOpen(false);       // as we already open the login/signup dialog, so no need of this profile dropdown now, so we will close it by setting it to false here
    }

    // Here this fn will log out the user and close the profile dropdown.
    const handleLogout = () => {
        setIsLoggedIn(false);    // as user is logout, so we will set isLoggedIn to false now.
        setIsOpen(false);
    }

    

    return ( 
        <div className="chatWindow">
            <div className="navbar">
                <span><img src="promptforge-logo.png"  alt="PromptForge"></img></span>

                <div className="userIconDiv"  onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {/* Here we will only show this dropdown when this isOpen is true actually */}
            {
                isOpen && (
                    <div className="dropDown">
                        {
                            isLoggedIn ? (
                                <div className="dropDownItem" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i> LogOut
                                </div>
                            ) : (
                                <>
                                    <div className="dropDownItem" onClick={() => openAuthModal("login")}>
                                        <i className="fa-solid fa-arrow-right-to-bracket"></i> LogIn
                                    </div>
                                    <div className="dropDownItem" onClick={() => openAuthModal("signup")}>
                                        <i className="fa-solid fa-arrow-right-to-bracket"></i> SignUp
                                    </div>
                                </>
                            )
                        }
                    </div>
                )
            }

            {/* Now here we will render this AuthModal component here But we have written conditions inside this component such that it will only show dialog, when user clicks either on login or signup i.e when showAuthModal is set to true & otherwise this component will return null, which means nothing will gets rendered here for this component then*/}
            <AuthModal />


            {/* Here we will render this Chat component to display all the chat messages till now of this current thread */}
            <Chat/>

            {/* Here we are adding a ring loader which will appear while we will be waiting for response i.e when user enter some prompt & click submit button or enter, then it will take some time to get the response back from Groq model
            SO in that meantime, we will show this loader indicating that reponse is been generated currently, so please wait for some time */}
            <RingLoader color="#fff"  loading={loading}  size={50} />
            {/* loading={loading} :- A boolean prop that controls whether the loader is visible. If loading is true, the spinner animates. If loading is false, the spinner is hidden. */}

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

                <p className="info">PromptForge uses AI model and can make mistakes. Please verify important details.</p>
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
