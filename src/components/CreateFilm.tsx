import React, { useState, ChangeEvent, FormEvent } from "react"
import axios from "axios"
import Navbar from "./Navbar";
import {useNavigate, useParams} from "react-router-dom";
import Film from "./Film";

const CreateFilm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
    };

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
        const rawDate = event.target.value;
        const dateObject = new Date(rawDate);
        const formattedDate = dateObject.toISOString().replace('T', ' ').slice(0, -5);

        setReleaseDate(formattedDate);
    };

    const handleAgeRatingChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setAgeRating(event.target.value);
    };

    const handleRuntimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRuntime(event.target.value);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!title || !description || !genre || !image) {
            setErrorFlag(true);
            setErrorMessage("Please fill in all required fields.");
            return;
        }


        const film = {
            title: title,
            description: description,
            releaseDate: releaseDate == "" ? undefined : releaseDate,
            genreId: parseInt(genre),
            runtime: runtime == "" ? undefined : parseInt(runtime),
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

            navigate(`/films/${response.data.filmId}`)
        } catch (error: any) {
            const statusCode = error.response ? error.response.status : 500;
            setErrorFlag(true);

            if (statusCode === 400) {
                setErrorMessage("Bad Request");
            } else if (statusCode === 401) {
                setErrorMessage("Unauthorized");
            } else if (statusCode === 403) {
                setErrorMessage("Forbidden. Film title is not unique, or cannot release a film in the past");
            } else if (statusCode === 500) {
                setErrorMessage("Internal Server Error. Please try again later.");
            }
        }
    };
        return (
            <div>
                <Navbar />
                <div className="container-xxl">
                    <div className="container-md">
                        <h3>Create a Film</h3>
                            <div className="card">
                                {errorFlag && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="card-body">
                                    <form onSubmit={handleSubmit} className="row">
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
                                        <div className="col-md-6">
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
                                        <div className="modal-footer">
                                            <button type="submit" className="btn btn-primary">
                                                Create Film
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                    </div>
                </div>
            </div>
        )
};

export default CreateFilm;