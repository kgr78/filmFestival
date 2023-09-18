import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import '../styles/RegisterUserDisplay.css'
const RegisterUser = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [registeredUser, setUser] = React.useState()
    const [imageErrorFlag, setImageErrorFlag] = useState(false);
    const [imageErrorMessage, setImageErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPasswordToggle = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setProfileImage(event.target.files[0]);
            handleProfileUpload()
        }
    }

    const handleRegistration = async (event: React.FormEvent) => {
        event.preventDefault();

        const tldRegex = /^[A-Za-z]{2,}$/;

        if (!tldRegex.test(email.split('.').pop() || '')) {
            setErrorFlag(true);
            setErrorMessage("Invalid email format. Please enter a valid email address.");
            return;
        }

        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        }

        const loginUser = {
            email: email,
            password: password,
        }
        try {
            if (profileImage) {
                await handleProfileUpload();
            }

            const responseRegister = await axios.post("http://localhost:4941/api/v1/users/register" , user)
            const responseLogin = await axios.post("http://localhost:4941/api/v1/users/login" , loginUser)
            const { userId, token } = responseLogin.data;
            localStorage.setItem("userId", userId.toString())
            localStorage.setItem("token", token)

        } catch (error: any) {
            const statusCode = error.response ? error.response.status : 500;
            setErrorFlag(true);

            if (statusCode === 400) {
                setErrorMessage("Bad Request. Invalid information.");
            } else if (statusCode === 403) {
                setErrorMessage("Forbidden. Email already in use.");
            } else if (statusCode === 500) {
                setErrorMessage("Internal Server Error. Please try again later.");
            }
        }
    }

    const handleProfileUpload = async () => {
        if (profileImage) {
            const config = {
                headers: {
                    "X-Authorization": localStorage.getItem("token"),
                    "Content-Type": profileImage.type
                }
            };

            try {
                const responseFindImage = await axios.put(
                    `http://localhost:4941/api/v1/users/${localStorage.getItem("userId")}/image`,
                    profileImage,
                    config
                );
            } catch (error) {
                setImageErrorFlag(true);
                setImageErrorMessage("An error occurred while uploading the image. Please try again.");
            }
        }
    }

        return (
            <div>
                <Navbar/>
                <div className="container-xxl">
                    <div className="container-md ">
                        <div className="card">
                            <div className="card-body">
                                <h2>User Registration</h2>
                                <form onSubmit={handleRegistration}>
                                    {errorFlag && (
                                        <div className="alert alert-danger" role="alert">
                                            {errorMessage}
                                        </div>
                                    )}

                                    {imageErrorFlag && (
                                        <div className="alert alert-danger" role="alert">
                                            {imageErrorMessage}
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={firstName}
                                            onChange={handleFirstNameChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={lastName}
                                            onChange={handleLastNameChange}
                                            required
                                        />
                                    </div>
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
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                id="password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                minLength={6}
                                                required
                                            />
                                            <div className="input-group-append">
                                              <span className="input-group-text show-password-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id="showPassword"
                                                    checked={showPassword}
                                                    onChange={handleShowPasswordToggle}
                                                />{" "}
                                                  Show
                                              </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="profileImage">Profile Image (optional):</label>
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            id="profileImage"
                                            accept=".jpg,.jpeg,.png,.gif"
                                            onChange={handleProfileImageChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Register
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default RegisterUser