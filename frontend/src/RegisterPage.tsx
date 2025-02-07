import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css"; // Importa fișierul CSS pentru pagina de înregistrare

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    fetch("http://localhost/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.status === 201) {
          alert("Registration successful! You can now log in.");
          navigate("/login");
        } else {
          alert("Registration failed. Try again.");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Something went wrong.");
      });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleChangeEmail}
            placeholder="Enter your email"
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handleChangePassword}
            placeholder="Enter password"
          />
        </div>
        <div className="input-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
            placeholder="Confirm password"
          />
        </div>
        <button onClick={handleSubmit}>Register</button>
        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
