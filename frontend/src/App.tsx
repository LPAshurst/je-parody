import { useState } from 'react'
import './App.css'

function App() {
  const [serverData, setServerData] = useState("");

  async function createUser() {

    const content = {username: "Lorenzo", email: "LorenzoaAshurst@gmail.com"}
    const url = "http://lorenzopi.local:3000/user/create_user"
    const response = await fetch(url,
      {
        method: 'POST',
        body: JSON.stringify(content),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      console.log(response.statusText);
    }

  }
  
    async function retrieveUser(username: String) {
    const url = `http://lorenzopi.local:3000/user/retrieve_user/${username}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.log(response.statusText);
    } else {
      const data = await response.json();
      setServerData(data.email);
    }

  }

  return (
    <>
      <div>
        <h1>
          Welcome, try and use my rust server
        </h1>

        <button onClick={createUser}>Press me to create user</button>
        <button onClick={() => retrieveUser("Lorenzo")}>Press me to retrieve a user</button>
        <h2>Custom Data from rust:</h2>
        <p>{serverData}</p>
      </div>
    </>
  )
}

export default App
