//-------------------------------------------------------------------------------------
// Project :- PromptForge

// A full-stack MERN AI chat application that leverages OpenAI APIs to transform user prompts into intelligent, personalized, and context-aware responses.
//-------------------------------------------------------------------------------------

// This app.jsx actually contains the main component i.e app component of react app
// Now whenever we want to write react code, we do not make any changes to index.html or main.jsx but all the changes we make in this app.jsx file because it contains the main app component.


import { useState } from 'react'
import './App.css'

import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';

import { MyContext } from './MyContext.jsx';



function App() {
  // This variable is meant to hold the values or state variables we want to pass into a Context Provider (like MyContext.Provider).
  // SO in this we will write those state variables and their set functions which we want to pass into a Context Provider (like MyContext.Provider).
  // Here we are doing this because the state variable which we pass here will be used in more then 1 components, so instead of passing them as props which became complex, we will simplt create them here & then can directly use them anywhere using this MyContext actually.
  const providerValues = {};

  return (
    <div className='app'>
      {/* The value prop is what gets passed down through the context. */}
      {/* MyContext.Provider makes that bag i.e all the providerValues available to all children which we written inside this i.e SideBar and ChatWindow component. */}
      <MyContext.Provider value={providerValues}>
        <Sidebar/>
        <ChatWindow/>
      </MyContext.Provider>
    </div>
  )
}

export default App





//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// public folder :-
// It is actually the root folder of our react app, so we can access the images inside 'public' folder using relative path from 'public' folder. 
// It means that React will automatically look for the image in the 'public' folder of our project, and we don't need to specify the full path from the root directory. This is a convenient feature of React that allows us to easily reference static assets like images, fonts, and other files without worrying about the exact file structure of our project.
// This is a convenient feature of React that allows us to easily reference static assets like images, fonts, and other files without worrying about the exact file structure of our project.

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// React Props :-
// Props are the imformation that you pass to a JSX tag in the form of attributes(like HTML attributes) just like we pass the arguments in fn in JS.
// SO the information that we pass during component call or component rendering are actually the React Props

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// State in React :-
// The State is a built-in React object that is used to contain data or information about the component.
// A component's state can change over time; whenever it changes, the component re-renders.

// SO when we want to re-renders the components, we make use of state.

// so for normal variables or props (which are immutable) if they changes, they don't re-renders the component, so those changes won't be visible in UI
// Normal variables: If you declare something like let count = 0, React will render it once. Updating that variable later doesn’t trigger a re-render, so the UI won’t reflect the change. React has no way of knowing that the variable changed.
// Props: Props are immutable by design. A component re-renders only if its parent re-renders and passes new props down. You can’t directly “mutate” props inside a child component to cause a re-render.

// So component only re-renders if changes occurs in state which is a object 

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


