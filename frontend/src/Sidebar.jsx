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



    // Here using this fn, we are actually creating the new chat or new thread here 
    const createNewChat = () => {
        // Here this newChat state variable stores true if user just created some new chat i.e actually just created new thread, otherwise it will store false, means currently user doesn't created any new chat & it is some older chat or thread actually
        // But as here we are creating new chat or thread, so we will update it with true now. 
        setNewChat(true);   
        setPrompt("");   // as for this new chat, currently prompt will be empty string only as we have just created this now
        setReply(null);   // as we created this new chat, so for this currently there will be no reply object, we will store null to indicate that we haven't got any reply yet
        setCurrThreadId(uuidv4());   // as we have just created this new chat or thread, so we need to assign a unique Thread id to this as we know that we only assign this threadId once when we created the new Thread & here we are actually creating new thread only
        setPrevChats([]);    // here currently we are setting prevChats to be empty array of objects as we have just created this new Thread, so there will be no prev chats exists for this curr thread, so this prevChats array must be empty
    }


    // Here we will use this fn to switch to some already created thread oresent in history section of sidebar
    // And then we will display all the prev chats of that thread in the output window actually
    // Here this newThreadId is actually the id of the Thread to which we want to switch & then want to display all the chats of that thread
    // It will be async fn as we are fetching data from database here
    const switchThread = async (newThreadId) => {
        // As to switch to this particular Thread having id as 'newThreadId',  we will now set the currThreadId state variable with this particular Thread id
        // So that now our present currThreadId became this, which means that we are now on this particular thread actually.
        setCurrThreadId(newThreadId);

        try {
            // Here we are using fetch, but if we want we cal also use axios.
            // As here we are not passing any options like method: "GET" or "POST", so it will consider the default method i.e "GET method actually"
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            // Here we are fetching all the chats or messages which user created & gets their reply from Groq model, from this current Thread using the route which we created in backend.
            
            // This will returns a Response object. To read the actual JSON data, we call .json().
            // This is asynchronous, so we use await again.
            const res = await response.json();
            // It will return the array of objects documents back to us in JSON format where each object either represents user message or groq reply
            
            console.log(res);

            // Now we need to set the prevChats state variable with these previous messages or chats of this current Thread, so that it can display all those messages or chats in output window using Chat component actually
            // As now prevchats state variable changes, so inside Chat component, all components gets gets re-rendered, so now Chat will display all the messages of this curr Thread now in output window.
            setPrevChats(res);

            // Here as this is not some new Chat or Thread, but we are just switching to some already created Thread, so we will set newChat state variable to false as true means that a new Thread is just created but it is not the case here
            setNewChat(false);

            // As we have not pass any new prompt yet in this curr Thread, so currently reply will be null only
            setReply(null);
        } catch(err) {
            // If anything goes wrong (network error, invalid API key, bad request),
            // the error is caught here. We log it so you can debug.
            console.log(err);
        }
    }



    // This fn will delete this thread from the database & then also remove it from the history section of the sidebar also.
    // Here this threadId is actually the id of the Thread which we want to delete 
    // It will be async fn as we are deleting this curr thread from database here
    const deleteThread = async (threadId) => {
        try {
            // Here we are using fetch, but if we want we cal also use axios.
            // As here if we don't pass any options like method: "GET" or "POST", so it will consider the default method i.e "GET method actually"
            // But for "DELETE" method we need to pass that as object form here 
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            // It will delete this thread from the database and then return that deleted thread all messages i.e array of message objects actually as response
            
            // This will returns a Response object. To read the actual JSON data, we call .json().
            // This is asynchronous, so we use await again.
            const res = await response.json();
            // It will return the array of objects documents back to us in JSON format where each object either represents user message or groq reply
            
            console.log(res);

            // Updated threads gets re-render
            // Update React state: remove the deleted thread from allThreads.
            // prev.filter(...) creates a new array excluding the deleted thread.
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            // Here prev represents all the thread which are shown in history section, so we are applying filter fn on those array of Thread objects
            // So we are finding all those thread objects whose id is not equal to this deleted thread, so filter fn will return all those thread objects array & then we will set the allThreads state variables with that
            // So as now state variable gets changes, so re-rendering happens & during re-rendering, now in history section, all these updated threads will be shown only


            // If the deleted thread was the currently active one, reset by creating a new empty chat.
            // Now if this curr thread which we are deleting is currently active i.e its chats or messages are displaying on output window, so we need to remove those also now
            // And for that, simpliest way is to show new chat or thread window now
            if(threadId === currThreadId){
                createNewChat();
            }
        } catch(err) {
            // If anything goes wrong (network error, invalid API key, bad request),
            // the error is caught here. We log it so you can debug.
            console.log(err);
        }
    }




    return ( 
        <section className="sidebar">
            {/* PromptForge logo */}
            <div className="promptforge-logo">
                <a href="#"><img src="src/assets/blacklogo.png"  alt="promptforge logo"  className="logo"></img></a>
            </div>

            {/* New chat button */}
            {/* We want that whenever we click on this New Chat button, a new chat or Thread gets created with some unique threadId actually. And as new chat is creating, all all the previous thread history also gets updated in sidebar as here this currThreadId state variable is changing now*/}
            <button onClick={createNewChat}>
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
                        <li key={idx}
                            onClick={(event) => (switchThread(thread.threadId))}      // So, When any list item is clicked, it calls the switchThread function. Passes the threadId of the clicked thread so the app can switch to that thread.
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                            // If the current thread’s ID matches currThreadId state variable, the item gets the "highlighted" class (to visually mark the active thread). Otherwise, it gets a blank class (" ").
                        >
                            <div className="title">{thread.title}</div>

                            {/* Here we will use this delete icon to delete this current thread from history section if user clicks this icon of any thread */}
                            <i className="fa-solid fa-trash"
                                onClick={(event) => {
                                    // As here we are using multiple statements, so that's we are using  => {} this & not this => () as it is used for single statement case.
                                    
                                    // Here this will Prevents the click event from bubbling up to parent elements.
                                    // Without this, clicking the trash icon could also trigger the parent <li>’s onClick (like changing the thread), which is not desired when deleting.
                                    event.stopPropagation();    // stop event bubbling
                                    deleteThread(thread.threadId);   // Calls this function to delete the thread with the given threadId. This is the actual action tied to the trash icon.
                                }}
                            ></i>
                        </li>
                    ))
                    // What is event.stopPropagation()? :-
                    // In JavaScript (and React), events bubble up the DOM tree by default. That means if you click on a child element, the event also travels up to its parent, grandparent, and so on — triggering any parent event listeners.
                    // event.stopPropagation() is a method that stops this bubbling process. So the event is handled only by the element you clicked, and it won’t trigger handlers on parent elements.
                    // Imagine you have: A list item (<li>) that changes the current thread when clicked. & A trash icon (<i>) inside that <li> to delete the thread.
                    // If you click the trash icon:
                    // Without stopPropagation() → the click bubbles up, so both deleteThread and changeThread run. That means you delete the thread and switch to it (unwanted behavior).
                    // With stopPropagation() → only deleteThread runs. The parent <li>’s click handler is ignored.
                }
            </ul>

            {/* Small Sign showing who the app belongs to */}
            <div className="sign">
                <p>Created with ❤️ by <span>Arpit Pal</span></p>
            </div>
        </section>
    );
}




