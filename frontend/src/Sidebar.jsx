// Here we are creating this 'Sidebar' component to be used in the frontend of this project.


import "./Sidebar.css";

export default function Sidebar() {
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
                <li>thread 1</li>
                <li>thread 2</li>
                <li>thread 3</li>
            </ul>

            {/* Small Sign showing who the app belongs to */}
            <div className="sign">
                <p>By Arpit Pal &hearts;</p>
            </div>
        </section>
    );
}




