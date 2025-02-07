import { ChangeEvent, useState } from "react";
import { useAuth } from "./AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Importă fișierul CSS

const LoginPage = () => {
  const [inputValueEmail, setInputValueEmail] = useState("");
  const [inputValuePassword, setInputValuePassword] = useState("");

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValueEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValuePassword(event.target.value);
  };

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    fetch("http://localhost/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: inputValueEmail,
        password: inputValuePassword,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            auth.setToken(data.token);
            auth.setIsAuthenticated(true);
            auth.setEmail(inputValueEmail);
            navigate("/matches");
          });
        } else if (response.status === 401) {
          alert("Invalid credentials");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Invalid credentials");
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={inputValueEmail}
            onChange={handleChangeEmail}
            placeholder="Enter your email"
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={inputValuePassword}
            onChange={handleChangePassword}
            placeholder="Enter your password"
          />
        </div>
        <button onClick={handleSubmit}>Log In</button>
        <div className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
