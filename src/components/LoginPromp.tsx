import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const LoginPromp = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false)
    const handleLogin = async() => {
        navigate("/login")
    }

    const handleRegister = async() => {
        navigate("/register")
    }


    return (
        <div>
            <button
                type="button"
                className="btn btn-info"
                onClick={() => setShowModal(true)}
            >
                Review Film
            </button>

            {showModal && (
                <div className="modal" tabIndex={-1} role="dialog" style={{ display: "block"}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Login</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setShowModal(false)}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Login or Register to place a Review</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleRegister}
                                >
                                    Register
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    )
}
export default LoginPromp