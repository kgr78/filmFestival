import axios from 'axios';
import React, {ChangeEvent, useState} from "react";
import '../styles/filmDisplay.css';
import './Navbar'
import {useParams} from "react-router-dom";
import Navbar from "./Navbar";
import defaultProfileImage from "./logo192.png";
import EditFilm from "./EditFilm";
import DeleteFilm from "./DeleteFilm";
import Review from "./Review";
import LoginPromp from "./LoginPromp";


const Film = () => {
    const { id } = useParams();
    const [film, setFilm] = React.useState<FilmFull | null>(null);
    const [similarFilms, setSimilarFilms] = React.useState < Film[] > ([])
    const [reviews, setReviews] = useState <Review[]> ([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [userHasReviewed, setUserHasReviewed] = useState(false);
    const [notDirector, setNotId] = useState(false);
    const [correctDate, setCorrectDate] = useState(false);

    const fetchFilmReviews = async  () => {
        try {
            const response = await axios.get(`http://localhost:4941/api/v1/films/${id}/reviews`);
            const fetchedReviews = response.data
            setReviews(fetchedReviews)

            const userId = localStorage.getItem("userId");
            if (userId) {
                const hasReviewed = fetchedReviews.some((review: Review) => review.reviewerId === parseInt(userId));
                setUserHasReviewed(hasReviewed);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const  fetchFilmsByDirectorAndGenre = async () => {
        try {
            const response = await axios.get('http://localhost:4941/api/v1/films', {
                params: {
                    directorId: film?.directorId,
                },
            });

            const response2 = await axios.get('http://localhost:4941/api/v1/films', {
                params: {
                    genreIds: film?.genreId
                },
            });
            const filmsByDirector = response.data.films;
            const filmsByGenre = response2.data.films;
            const uniqueFilms = filmsByDirector.filter((film: Film) => {
                return !filmsByGenre.some((f: Film) => f.filmId === film.filmId);
            });

            setSimilarFilms(uniqueFilms)
        } catch (error) {
            console.error(error);
        }
    }

    const fetchFilmById = async () => {
        try {
            const response = await axios.get(`http://localhost:4941/api/v1/films/${id}`);
            const fetchedFilm: FilmFull = {
                description: response.data.description,
                numReviews: response.data.numReviews,
                runtime: response.data.runtime,
                filmId: response.data.filmId,
                title: response.data.title,
                genreId: response.data.genreId,
                releaseDate: new Date(response.data.releaseDate).toLocaleDateString(),
                directorId: response.data.directorId,
                directorFirstName: response.data.directorFirstName,
                directorLastName: response.data.directorLastName,
                rating: response.data.rating,
                ageRating: response.data.ageRating,
            };
            setFilm(fetchedFilm);

            if (String(film?.directorId )== localStorage.getItem("userId")) {
                setNotId(true)
            }
            const currentDate = new Date();
            if (new Date(response.data.releaseDate) < currentDate) {
                setCorrectDate(true)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleEdit = () => {
        if (localStorage.getItem("userId")) {
            if (localStorage.getItem("userId" )== String(film?.directorId)) {
                if (film?.numReviews && film.numReviews > 0) {
                    return (
                        <div className="d-flex justify-content-between">
                            <EditFilm/>
                        </div>
                    )
                }
                return (
                    <div className="d-flex justify-content-between">
                        <EditFilm/>
                        <DeleteFilm/>
                    </div>
                )
            }
        }

    }

    const handleReview = () => {
        if (localStorage.getItem("token")) {
            if (!userHasReviewed) {
                return (<Review />)
            }
        } else {
            return (<LoginPromp/>)
        }
    }

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const imageElement = event.target as HTMLImageElement;
        imageElement.src = defaultProfileImage;
    };

    React.useEffect(() => {
        fetchFilmById()
        fetchFilmReviews()
    }, [id])

    React.useEffect( () => {
        fetchFilmsByDirectorAndGenre()
    }, [film?.directorId, film?.genreId])

    if (errorFlag) {
        return (
            <div>
                <h1>Error</h1>
                <div style={{ color: "red" }}>
                    {errorMessage}
                </div>
            </div>
        );
    } else if (film) {
        return (
            <div>
                <Navbar />
                <div className="container-xxl">
                    <div className="container-md">
                            <div className="card" style={{ width: '100%' }}>
                                <img
                                    src={`http://localhost:4941/api/v1/films/${film.filmId}/image`}
                                    className="card-img-top"
                                    alt="..."
                                    style={{ objectFit: 'cover',maxHeight: '400px' }}
                                    onError={handleImageError}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{film.title}</h5>
                                    <div className="d-flex">
                                        <div className="fixed-column">
                                            <img
                                                src={`http://localhost:4941/api/v1/users/${film.directorId}/image`}
                                                className="card-img-top"
                                                alt="..."
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                }}
                                                onError={handleImageError}
                                            />
                                            <p>{film.directorFirstName + " " + film.directorLastName}</p>
                                        </div>
                                        <div className="fixed-column">
                                            <p>Description: {film.description}</p>
                                            <p></p>
                                            <p>Release date: {film.releaseDate}</p>

                                            <p>Rating: {film.rating}</p>
                                            <p>Total Reviews: {film.numReviews}</p>
                                        </div>
                                    </div>
                                    {handleEdit()}
                                    {handleReview()}
                                </div>
                            </div>
                        {reviews.length > 0 ? (
                            <div className="container">
                                <h3>Reviews</h3>
                                <div id="reviewCarousel" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-inner">
                                        {reviews.map((review, index) => (
                                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className="card-title">{`${review.reviewerFirstName} ${review.reviewerLastName}`}</h5>
                                                        <div className="d-flex">
                                                            <div className="fixed-column">
                                                                    <img
                                                                        src={`http://localhost:4941/api/v1/users/${review.reviewerId}/image`}
                                                                        className="card-img-top"
                                                                        alt="..."
                                                                        style={{
                                                                            width: '50px',
                                                                            height: '50px',
                                                                            borderRadius: '50%',
                                                                            objectFit: 'cover',
                                                                        }}
                                                                        onError={handleImageError}
                                                                    />
                                                                <p>{review.reviewerFirstName + ' ' + review.reviewerLastName}</p>
                                                            </div>
                                                            <div className="fixed-column">
                                                                <p>Rating: {review.rating}</p>
                                                                {review.review && <p>Review: {review.review}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {reviews.length > 1 && (
                                        <>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#reviewCarousel" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#reviewCarousel" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : null}
                        {similarFilms.length > 0 ? (
                            <div className="container">
                                <h3>Similar Films</h3>
                                <div id="similarFilmsCarousel" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-inner">
                                        {similarFilms.map((similarFilms, index) => (
                                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <img
                                                            src={`http://localhost:4941/api/v1/films/${similarFilms.filmId}/image`}
                                                            className="card-img-top"
                                                            alt="..."
                                                            style={{ objectFit: 'cover',maxHeight: '300px' }}
                                                        />
                                                        <h5 className="card-title">{similarFilms.title}</h5>
                                                        <div className="d-flex">
                                                            <div className="fixed-column">
                                                                <img
                                                                    src={`http://localhost:4941/api/v1/users/${similarFilms.directorId}/image`}
                                                                    className="card-img-top"
                                                                    alt="..."
                                                                    style={{
                                                                        width: '50px',
                                                                        height: '50px',
                                                                        borderRadius: '50%',
                                                                        objectFit: 'cover',
                                                                    }}
                                                                    onError={handleImageError}
                                                                />
                                                                <p>{similarFilms.directorFirstName + ' ' + similarFilms.directorLastName}</p>
                                                            </div>
                                                            <div className="fixed-column">
                                                                <p>Age Rating: {similarFilms.ageRating}</p>
                                                                <p>Genre: {similarFilms.genreId}</p>
                                                                <p>Rating: {similarFilms.rating}</p>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {similarFilms.length > 1 && (
                                        <>
                                            <button className="carousel-control-prev" type="button" data-bs-target="#similarFilmsCarousel" data-bs-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Previous</span>
                                            </button>
                                            <button className="carousel-control-next" type="button" data-bs-target="#similarFilmsCarousel" data-bs-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Next</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    } else {
        return <div>Loading...</div>;
    }
}

export default Film;