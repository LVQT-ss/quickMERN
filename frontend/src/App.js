import { useEffect } from 'react';
import axios from 'axios';
function App() {

  useEffect(()=> {
    axios.get('http://localhost:5555/books').then(
      response => console.log(response)
    )
  },[])
  
  return (
    <>
    <div>
      <h1>Welcome to MERN App</h1>
      <h2>This is a simple MERN App</h2>
      <p>This app is built using React, Express, MongoDB, and Node.js</p>
    </div>
    </>
  );
}

export default App;
