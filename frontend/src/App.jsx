//-------------------------------------------------------------------------------------
// Project :- PromptForge

// A full-stack MERN AI chat application that leverages OpenAI APIs to transform user prompts into intelligent, personalized, and context-aware responses.
//-------------------------------------------------------------------------------------

// This app.jsx actually contains the main component i.e app component of react app
// Now whenever we want to write react code, we do not make any changes to index.html or main.jsx but all the changes we make in this app.jsx file because it contains the main app component.


import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>

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

