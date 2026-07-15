// Here we are creating this 'Sidebar' component to be used in the frontend of this project.


import "./Sidebar.css";

// useContext :-
// A React hook for consuming context values.
// It allows us to access data/functions provided by a Context.Provider without prop drilling.
import { useContext, useEffect } from "react";
// useContext :- Allows you to access values from a React Context (shared data across components without prop drilling).
// Example: const theme = useContext(ThemeContext);
// useEffect :- Runs side effects in your component (like fetching data, subscribing to events, or updating the DOM).

import { MyContext } from "./MyContext.jsx";
// MyContext → This is a context we created in MyContext.jsx using React.createContext().
// { MyContext } → The curly braces mean we’re importing a named export (not the default export) from that file.

// Here we are importing uuid to use it here.
import { v4 as uuidv4 } from "uuid";
// But to use it, we need to install uuid using :- npm install uuid 



export default function Sidebar() {
    // Here we are using React Context + destructuring to pull out multiple values from your MyContext provider
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);
    // useContext(MyContext) :- Reads the current value of MyContext.
    // Whatever we passed into <MyContext.Provider value={...}> higher up in your component tree becomes available here.


    // Here we will use this fn to all the Threads from the database actually.
    const getAllThreads = async () => {
        try {
            // Here we are using fetch, but if we want we cal also use axios.
            const response = await fetch("http://localhost:8080/api/thread");
            
            // This will returns a Response object. To read the actual JSON data, we call .json().
            // This is asynchronous, so we use await again.
            const res = await response.json();
            // It will return the array of thread documents back to us in JSON format
            
            // Now we will filter this array of threads to only get threadId and title from each threads here
            // As to show Thread in sidebar, we need their title as that will became the heading of thread 
            // And also if we want that when user click on any thread, it will opem all the thread history, we will make use of route which we already created in backend, but for that we need the threadId of that particular thread, so that's why we need threadId here
            // So from each thread, we will get an object containing only threadId & its title actually
            // So this filteredData will be an array of objects actually
            const filteredData = res.map((thread) => ({threadId: thread.threadId, title: thread.title}));

            console.log(filteredData);

            // So now this 'allThreads' state variable will contains this array of filtered objects actually
            setAllThreads(filteredData);
        } catch(err) {
            // If anything goes wrong (network error, invalid API key, bad request),
            // the error is caught here. We log it so you can debug.
            console.log(err);
        }
    };


    // useEffect is a React Hook that lets us perform side effects in function components.
    // In this case, it runs the getAllThreads() function whenever currThreadId state variable gets change & it will change when new thread created.
    // SO whenever we create new thread, then it means that currThreadId state variable get assigned with new uuid, it means that it gets changed, so we will update this allThreads state variables
    // So whenever we refresh the page, or click on new CHat, so new thread gets created, so we will update the Thread history in sidebar using this allThreads state variables by showing all the threads created till now in thread history except this curr newly created thread, as this will be added in thread history only when some new thread gets created or we refresh the page  as then also currThreadId gets changes actuallly
    useEffect(() => {
        // This function call will fetch or update all threads. It is like as "refreshing" the thread list whenever the current thread ID changes i.e when some new thread created.
        getAllThreads();
    }, [currThreadId])



    return ( 
        <section className="sidebar">
            {/* PromptForge logo */}
            <div className="promptforge-logo">
                <a href="#"><img src="src/assets/blacklogo.png"  alt="promptforge logo"  className="logo"></img></a>
            </div>

            {/* New chat button */}
            <button>
                <span><i className="fa-solid fa-pen-to-square"></i> New Chat</span>
            </button>

            {/* History section */}
            <ul className="history">
                {/* Now here we will display all the Threads titles which created till now to show the thread history actually*/}
                {/* The ?. operator is optional chaining → prevents errors if allThreads is null or undefined. If allThreads is null/undefined, .map(...) won’t run and will safely return undefined.
                Without optional chaining (e.g., allThreads.map(...)), the code assumes allThreads is always defined. If it’s null/undefined, this throws: “Cannot read properties of undefined (reading 'map')”. */}
                {/* .map((thread, idx) => (...)) → Iterates through each thread object in allThreads.
                thread → current thread object
                idx → index of the thread (used as React key) to uniquely identify each li element for React */}
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}>
                            {thread.title}
                        </li>
                    ))
                }
            </ul>

            {/* Small Sign showing who the app belongs to */}
            <div className="sign">
                <p>By Arpit Pal &hearts;</p>
            </div>
        </section>
    );
}




