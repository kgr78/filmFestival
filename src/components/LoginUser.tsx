import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../styles/loginDisplay.css'

const LoginUser: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const tldRegex = /^[A-Za-z]{2,}$/;

        if (!tldRegex.test(email.split('.').pop() || '')) {
            setErrorFlag(true);
            setErrorMessage("Invalid email format. Please enter a valid email address.");
            return;
        }

        const loginUser: UserLogin = {
            email,
            password,
        };

        try {
            const response = await axios.post(
                "http://localhost:4941/api/v1/users/login",
                loginUser
            )
            const { userId, token } = response.data;
            localStorage.setItem("userId", userId.toString());
            localStorage.setItem("token", token);
            localStorage.setItem("password",password)
            localStorage.setItem("email", email)
            navigate("/films");

        } catch (error: any) {
            if (error.response) {
                const { status } = error.response;
                let errorMessage = "";

                switch (status) {
                    case 400:
                        errorMessage = "Bad Request. Invalid information";
                        break;
                    case 401:
                        errorMessage = "Not Authorized. Incorrect email/password";
                        break;
                    case 500:
                        errorMessage = "Internal Server Error";
                        break;
                    default:
                        errorMessage = "An error occurred";
                        break;
                }

                setErrorFlag(true);
                setErrorMessage(`${status}: ${errorMessage}`);
            } else {
                setErrorFlag(true);
                setErrorMessage("An error occurred");
            }
        }
    };

    return (
        <div className="container-md">
            <h2>Login</h2>
            <div className="card">
                <div className="card-body">
                    {errorFlag && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-info">
                            Login
                        </button>
                    </form>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-6 offset-md-3">
                    <div className="row">
                        <div className="col-md-6">
                            <p>Not a User? Register below</p>
                            <a className="btn btn-info btn-block" href="/register">
                                Register
                            </a>
                        </div>
                        <div className="col-md-6">
                            <p>Continue as Guest</p>
                            <a className="btn btn-success btn-block" href="/films">
                                Guest Access
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginUser