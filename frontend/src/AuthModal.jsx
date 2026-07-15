// Here we are creating this 'AuthModal' component to be used in the frontend of this project.

import "./AuthModal.css";
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



export default function AuthModal() {
    // Here we are using React Context to access the authentication state variables from App.jsx.
    const { authMode, setAuthMode, showAuthModal, setShowAuthModal, setIsLoggedIn } = useContext(MyContext);

    // Here this state variable will store the values entered by the user in the form.
    // So this state variable will store object actually
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });


    // Here we will use useEffect to clear the form whenever the modal or dialog closes as it means that user is not login/signing, so we will clear the form
    useEffect(() => {
        // So if showAuthModal is false, then it means that login/signup modal or dialog is closed, so we will clear the form
        if (!showAuthModal) {
            setFormData({ name: "", email: "", password: "" });
        }
    }, [showAuthModal]);


    // If the modal or dialog is not open, then do not render anything. so now this component will now show anything if this dialog is not open yet.
    if (!showAuthModal) return null;



    // This function updates the form values as user types.
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    // This function handles the form submission.
    const handleSubmit = (event) => {
        event.preventDefault();
        // this will prevent the default behaviour of the form on form submit.
        // So here we are controlling the internal state of this form during onSubmit

        // Here for now, we simply mark the user as logged in and close the modal.
        // In future, this can be replaced by actual backend login/signup logic.
        setIsLoggedIn(true);
        setShowAuthModal(false);
    };


    // SO on clicking on close button, we want to close the dialog, so we will set this showAuthModal to false now.
    const handleClose = () => {
        setShowAuthModal(false);
    };



    return (
        <div className="authModalOverlay">
            <div className="authModal">
                <div className="authModalHeader">
                    <h3>{authMode === "login" ? "Login" : "Sign Up"}</h3>
                    <button type="button" className="authModalClose" onClick={handleClose} aria-label="Close dialog">×</button>
                </div>

                <div className="authModeSwitch">
                    <button
                        type="button"
                        className={authMode === "login" ? "active" : ""}
                        onClick={() => setAuthMode("login")}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className={authMode === "signup" ? "active" : ""}
                        onClick={() => setAuthMode("signup")}
                    >
                        Sign Up
                    </button>
                </div>


                {/* Now we will take the user details using this form in React */}
                <form className="authForm" onSubmit={handleSubmit}>
                    {
                        authMode === "signup" && (
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        )
                    }

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="authSubmitBtn">
                        {authMode === "login" ? "Login" : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
