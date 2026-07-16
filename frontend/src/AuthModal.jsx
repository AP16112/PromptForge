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
    const { authMode, setAuthMode, showAuthModal, setShowAuthModal, setIsLoggedIn, setUser } = useContext(MyContext);

    // Here this state variable will store the values entered by the user in the form.
    // So this state variable will store object actually
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    // Here we will use useEffect to clear the form whenever the modal or dialog closes as it means that user is not login/signing, so we will clear the form
    useEffect(() => {
        // When the modal closes, clear the form and any errors.
        if (!showAuthModal) {
            setFormData({ name: "", email: "", password: "" });
            setError("");
            setSuccess("");
        }
    }, [showAuthModal]);

    const handleModeChange = (mode) => {
        if (mode === authMode) return;

        setAuthMode(mode);
        setFormData({ name: "", email: "", password: "" });
        setError("");
        setSuccess("");
    };

    // If the modal or dialog is not open, then do not render anything. so now this component will now show anything if this dialog is not open yet.
    if (!showAuthModal) return null;



    // This function updates the form values as user types.
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    // This function handles the form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const payload = {
            email: formData.email,
            password: formData.password,
        };

        if (authMode === "signup") {
            payload.name = formData.name;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/auth/${authMode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                console.log("Error response:", data.error);
                setError(data.error || "Authentication failed. Please try again.");
                return;
            }

            if (authMode === "signup") {
                setAuthMode("signup");
                setFormData({ name: "", email: "", password: "" });
                setError("");
                setSuccess(data.message || "Signup successful.");
                return;
            }

            setIsLoggedIn(true);
            setUser(data.user || null);
            setShowAuthModal(false);
        } catch (err) {
            console.error(err);
            setError("Network error. Please try again.");
        }
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
                        onClick={() => handleModeChange("login")}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className={authMode === "signup" ? "active" : ""}
                        onClick={() => handleModeChange("signup")}
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

                    <div className="passwordField">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="passwordToggle"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button type="submit" className="authSubmitBtn">
                        {authMode === "login" ? "Login" : "Create Account"}
                    </button>

                    <div className="authFeedback">
                        {success && <p className="authSuccess">{success}</p>}
                        {error && <p className="authError">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
}
