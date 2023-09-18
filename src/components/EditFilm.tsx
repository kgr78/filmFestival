import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import '../styles/EditProfileDisplay.css'

const EditFilm = () => {
    const {id} = useParams()
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [genre, setGenre] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [releaseDate, setReleaseDate] = useState("")
    const [ageRating, setAgeRating] = useState("")
    const [runtime, setRuntime] = useState("")
    const [genres, setAvailableGenres] = useState<{ id: number; name: string }[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);


    React.useEffect(() => {
        fetchGenres();
    }, []);

    const mapGenres = (genresData: any[]): { id: number; name: string }[] => {
        return genresData.map((genre) => ({
            id: genre.genreId,
            name: genre.name,
        }));
    };

    const fetOldFilmData = async () => {
        try {
            const response = await axios.get(`http://localhost:4941/api/v1/films/${id}`, {
            });
            const filmData = response.data;
            if (filmData) {
                setTitle(filmData.title);
                setAgeRating(filmData.ageRating);
                setDescription(filmData.description);
                setReleaseDate(filmData.releaseDate);
                setRuntime(String(filmData.runtime));
                setGenre(filmData.genreId);
            }
        } catch (error) {
            console.error(error);
        }
    }
    const fetchGenres = async () => {
        try {
            const response = await axios.get('http://localhost:4941/api/v1/films/genres');

            const genresData = response.data;
            if (genresData) {
                const mappedGenres = mapGenres(genresData);
                setAvailableGenres(mappedGenres);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const ageRatings = ["G", "PG", "M", "R13", "R16", "R18"];

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleGenreChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setGenre(event.target.value);
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0]);
        }
    };

    const handleReleaseDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setReleaseDate(event.target.value);
    };

    const handleAgeRatingChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setAgeRating(event.target.value);
    };

    const handleRuntimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRuntime(event.target.value);
    };

    const handleEditFilm = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!image) {
            setErrorFlag(true);
            setErrorMessage("Please add an Image");
            return;
        }


        const film = {
            title: title,
            description: description,
            datetime: releaseDate === "" ? undefined : releaseDate,
            genreId: parseInt(genre),
            runtime: runtime === "" ? undefined : parseInt(runtime),
            ageRating: ageRating == "" ? "TBC" : ageRating
        }

        const config2 = {
            headers: {
                "X-Authorization": localStorage.getItem("token"),
            }
        }

        const config1 = {
            headers: {
                "X-Authorization": localStorage.getItem("token"),
                "Content-Type": image.type
            }
        }

        try {
            const response = await axios.post(
                "http://localhost:4941/api/v1/films",
                film, config2)

            await axios.put(`http://localhost:4941/api/v1/films/${response.data.filmId}/image`,
                image,config1)

            setTitle("");
            setDescription("");
            setGenre("");
            setImage(null);
            setReleaseDate("");
            setAgeRating("");
            setRuntime("");
            setShowModal(false)
        } catch (error: any) {
            const statusCode = error.response ? error.response.status : 500;
            setErrorFlag(true);

            if (statusCode === 400) {
                setErrorMessage("Bad Request. Invalid information");
            } else if (statusCode === 401) {
                setErrorMessage("Unauthorized");
            } else if (statusCode === 403) {
                setErrorMessage("Forbidden. Only the director of an film may change it, cannot change the releaseDate since it has already passed, cannot edit a film that has a review placed, or cannot release a film in the past");
            } else if (statusCode === 404) {
                setErrorMessage("Not Found. No film found with id");
            } else if (statusCode === 500) {
                setErrorMessage("Internal Server Error. Please try again later.");
            }
        }

    }

    const openModal = () => {
        fetOldFilmData()
        setShowModal(true)
    };

    return (
        <div>
            <button className="btn btn-primary" onClick={openModal}>
                Edit Film
            </button>
            {showModal && (
                <div className="modal" tabIndex={-1} role="dialog" style={{ display: "block"}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content wide-modal">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Film</h5>
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
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="title">Title:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                value={title}
                                                onChange={handleTitleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="genre">Genre:</label>
                                            <select
                                                className="form-control"
                                                id="genre"
                                                value={genre}
                                                onChange={handleGenreChange}
                                                required
                                            >
                                                <option value="">Select a genre</option>
                                                {genres.map((genre) => (
                                                    <option key={genre.id} value={genre.id}>
                                                        {genre.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="releaseDate">Release Date:</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                id="releaseDate"
                                                value={releaseDate ? releaseDate.slice(0, 16) : ""}
                                                onChange={handleReleaseDateChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="ageRating">Age Rating:</label>
                                            <select
                                                className="form-control"
                                                id="ageRating"
                                                value={ageRating}
                                                onChange={handleAgeRatingChange}
                                            >
                                                <option value="">Select an age rating</option>
                                                {ageRatings.map((rating) => (
                                                    <option key={rating} value={rating}>
                                                        {rating}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="runtime">Runtime:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="runtime"
                                                value={runtime}
                                                onChange={handleRuntimeChange}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="image">Image:</label>
                                                    <input
                                                        type="file"
                                                        className="form-control-file"
                                                        id="image"
                                                        accept=".jpg,.jpeg,.png,.gif"
                                                        onChange={handleImageChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description:</label>
                                        <textarea
                                            className="form-control form-control-textarea"
                                            id="description"
                                            value={description}
                                            onChange={handleDescriptionChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="col-12">
                                        <div className="d-flex justify-content-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary mr-2"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleEditFilm}
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    )
}
export default EditFilm