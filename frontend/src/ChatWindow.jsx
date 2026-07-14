// Here we are creating this 'ChatWindow' component to be used in the frontend of this project.


import "./ChatWindow.css";

import Chat from "./Chat.jsx";


export default function ChatWindow() {
    return ( 
        <div className="chatWindow">
            <div className="navbar">
                <span>PromptForge <i class="fa-solid fa-chevron-down"></i></span>

                <div className="userIconDiv">
                    <span className="userIcon"><i class="fa-solid fa-user"></i></span>
                </div>
            </div>

            {/* Here we will render this Chat component to display all the chats or threads */}
            <Chat/>

            {/* Chat input section for taking the user input prompt*/}
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"></input>
                
                    <div id="submit"><i class="fa-solid fa-paper-plane"></i></div>
                </div>

                <p className="info">PromptForge can make mistakes. Check important info. See Cookie Preferences.</p>
            </div>
        </div>
    );
}

