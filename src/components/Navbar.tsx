import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import defaultProfileImage from "./logo192.png";
import '../styles/navbarDisplay.css';


const Navbar = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };


    const handleLogout = () => {
        const config = {
            headers: {
                "X-Authorization": localStorage.getItem("token")
            }
        }

        axios.post("http://localhost:4941/api/v1/users/logout", null,
            config)
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        localStorage.removeItem("password")
        localStorage.removeItem("email")
        navigate("/login");
    }

    const handleLogin = () => {
        navigate("/login");
    }


    const renderAuthButton = () => {
        const authToken = localStorage.getItem("token");
        if (authToken) {
            return (
                <button className="btn btn-danger" onClick={handleLogout} >
                    Logout
                </button>
            );
        } else {
            // User is logged out, display the login button
            return (
                <button className="btn btn-primary" onClick={handleLogin}>
                    Login
                </button>
            );
        }
    }

    const handleCreateFilm = () => {
        navigate("/creatFilm");
    }

    const handleViewFilms = () => {
        navigate("/films");
    }


    const renderCreateFilmButton = () => {
        const authToken = localStorage.getItem("token");
        if (authToken) {
            return (
                <button className="btn btn-info" onClick={handleCreateFilm}>
                    Create Film
                </button>

            )
        }
    }

    const renderViewFilms = () => {
        return (
            <button className="btn btn-info" onClick={handleViewFilms}>
                Films
            </button>
        )
    }

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const imageElement = event.target as HTMLImageElement;
        imageElement.src = defaultProfileImage;
    }

    const profilePicture = () => {

        const authToken = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (authToken) {
            return (
                <a href={`/user`}>
                    <img
                        src={`http://localhost:4941/api/v1/users/${userId}/image`}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginRight: "10px",
                        }}
                        onError={handleImageError}
                    />
                </a>
            )
        }


    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand" href="/">
                    Home
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleToggle}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className={`collapse navbar-collapse ${isCollapsed ? "show" : ""}`}
                    id="navbarNav"
                >
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">{renderCreateFilmButton()}</li>
                        <li className="nav-item">{renderViewFilms()}</li>
                        <li className="nav-item">{profilePicture()}</li>
                        <li className="nav-item">{renderAuthButton()}</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar