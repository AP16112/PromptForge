// Here we are creating this 'MyContext' component to be used in the frontend of this project.

// createContext is a React function for global state sharing.
import { createContext } from "react";
// It’s part of React’s Context API.
// createContext lets you create a Context object that can hold global data (like theme, authentication, or user settings).
// This data can then be shared across components without manually passing props down multiple levels.



//createContext :-
// This is React’s Context API function.
// It creates a Context object that can hold global values/functions and share them across components without prop drilling.
export const MyContext =  createContext("");
// createContext("") :- This function from React creates a new Context.
// The argument "" is the default value — used when a component consumes the context but isn’t wrapped inside a provider.
// In this case, the default value is an empty string.

// Here "" is simply the default value for your context. It’s what React will return if a component tries to use the context without being wrapped in a provider.
// e.g 
// import React, { createContext, useContext } from "react";

// export const MyContext = createContext(""); // default value is empty string

// const Child = () => {
//   const value = useContext(MyContext);
//   return <p>Context value: {value}</p>;
// };

// export const App = () => {
//   return (
//     <div>
//       <Child />
//     </div>
//   );
// };

// Here, since Child isn’t inside a <MyContext.Provider>, React uses the default value — the empty string — so the output will be:
// Context value:          --->  (nothing visible, because it’s an empty string)

// Now, if you wrap it with a provider:
// <MyContext.Provider value="Hello PromptForge!">
//   <Child />
// </MyContext.Provider>

// the output becomes:
// Context value: Hello PromptForge!
