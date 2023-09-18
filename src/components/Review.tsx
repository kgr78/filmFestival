import React, { useState, ChangeEvent, FormEvent } from "react"
import {useParams} from "react-router-dom";
import axios from 'axios';

const Review = () => {
    const {id} = useParams()
    const [showModal, setShowModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);

    const handleReviewTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReviewText(event.target.value);
    }

    const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRating(parseInt(event.target.value));
    };

    const handleSubmit = async () => {
        const creatReview = {
            rating: rating,
            review: reviewText
        }

        const config = {
            headers: {
                "X-Authorization": localStorage.getItem("token")
            }
        }

        try {
            const response = await axios.post(
                `http://localhost:4941/api/v1/films/${id}/reviews`,
                creatReview, config
            )

            setShowModal(false)
            window.location.reload();

        } catch (error: any) {
            const statusCode = error.response ? error.response.status : 500;
            setErrorFlag(true);

            if (statusCode === 400) {
                setErrorMessage("Bad Request. Invalid information");
            } else if (statusCode === 401) {
                setErrorMessage("Unauthorized");
            } else if (statusCode === 403) {
                setErrorMessage("Forbidden. Cannot review your own film, or cannot post a review on a film that has not yet released");
            } else if (statusCode === 404) {
                setErrorMessage("Not Found. No film found with id");
            } else if (statusCode === 500) {
                setErrorMessage("Internal Server Error. Please try again later.");
            }
        }

    }

    return (
        <div>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
            >
                Submit Review
            </button>

            {showModal && (
                <div className="modal" tabIndex={-1} role="dialog" style={{ display: "block"}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Submit Review</h5>
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
                                <div className="form-group">
                                    <label htmlFor="reviewText">Review:</label>
                                    <textarea
                                        className="form-control"
                                        id="reviewText"
                                        value={reviewText}
                                        onChange={handleReviewTextChange}
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="rating">Rating:</label>
                                    <select
                                        className="form-control"
                                        id="rating"
                                        value={rating || ""}
                                        onChange={handleRatingChange}
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );

}
export default Review