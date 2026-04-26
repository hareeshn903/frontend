import './App.css';
import { useState } from "react";
import Login from "./Login";
import Product from "./Product";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <div className="App">
      <h2>My Product App</h2>

      {!isLoggedIn ? (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <Product />
      )}
    </div>
  );
}

export default App;