import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("password");
        navigate("/films");
    };

    const isLocalStorageEmpty = () => {
        const item = localStorage.getItem("token");
        if (item === null || item === undefined) {
            return (
                <div className="container">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2>Get Your film ON</h2>
                            <div className="button-group">
                                <br/>

                                <a className="btn btn-info" href={'/login'}>
                                    Login
                                </a>
                                <br/>
                                <br/>
                                <a className="btn btn-info" href={'/register'}>
                                    Register
                                </a>
                                <br/>
                                <br/>
                                <a className="btn btn-success" href={'/films'}>
                                    Continue as Guest
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2>Get Your film ON</h2>
                            <div className="button-group">
                                <a className="btn btn-primary" href={'/films'}>
                                    Stay Logged in and Continue Back to Film
                                </a>
                                <br/>
                                <br/>
                                <button className="btn btn-primary" onClick={handleLogout}>
                                    Logout and continue as Guest
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            {isLocalStorageEmpty()}
        </div>
    );
};
export default Home