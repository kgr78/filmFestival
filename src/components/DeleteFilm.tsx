import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const DeleteFilm = () => {
    const navigate = useNavigate();
    const {id} = useParams()
    const [showModal, setShowModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [errorFlag, setErrorFlag] = useState(false)
    const handleDelete = async() => {
        const config = {
            headers: {
                "X-Authorization": localStorage.getItem("token"),
            }
        }

        try {
            const response = await axios.delete(`http://localhost:4941/api/v1/films/${id}`,config)
            setShowModal(false);
        } catch (error: any) {
            const statusCode = error.response ? error.response.status : 500;
            setErrorFlag(true);

            if (statusCode === 401) {
                setErrorMessage("Unauthorized");
            } else if (statusCode === 403) {
                setErrorMessage("Forbidden. Only the director of an film can delete it")
            } else if (statusCode === 404) {
                setErrorMessage("Not Found. No film found with id")
            } else if (statusCode === 500) {
                setErrorMessage("Internal Server Error. Please try again later.");
            }
        }
        setShowModal(false);
        navigate('/films')
    }

    return (
        <div>
            <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowModal(true)}
            >
                Delete Film
            </button>

            {showModal && (
                <div className="modal" tabIndex={-1} role="dialog" style={{ display: "block"}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Film</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setShowModal(false)}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {errorFlag && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <p>Are you sure you want to delete this film?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                >
                                    Delete
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
export default DeleteFilm