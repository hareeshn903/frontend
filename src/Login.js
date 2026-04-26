import { useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("BASE_URL:", BASE_URL);

      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          username,
          password
        }
      );

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data.token;

      localStorage.setItem("token", token);

      alert("Login success");
      onLoginSuccess();

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h3>Login</h3>

      <input onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <br /><br />

      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;