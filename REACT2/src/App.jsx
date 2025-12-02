import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/react/getall')
      .then((response) => response.json())
      .then((json) => setData(json.data)) // This part was correct
      .catch((error) => console.error("Error fetching data:", error));
  }, []); 

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      
      <h1>User List (Fetched on Load)</h1>
      
      <div className="card">
        

        <ul>
          {data.map((user) => (
            <li key={user._id}>
               {user.name} 
            </li>
          ))}
        </ul>

      </div>
    </>
  )
}

export default App