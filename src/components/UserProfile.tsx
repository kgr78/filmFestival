import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import Navbar from "./Navbar";
import EditProfile from "./EditProfile";
import defaultProfileImage from "./logo192.png";
const UserProfile = () => {
    const id  = localStorage.getItem("userId");
    const [userDetails, setUserDetails] = useState<UserReturnWithEmail[] >([]);
    const [films, setFilms] = React.useState < Film[] > ([])
    const [filmsReviewed, setFilmsReviewed] = React.useState < Film[] > ([])
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = React.useState(0);
    const [profileImage, setProfileImage] = useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const countPerPage = 6;


    const handlePageClick = (page: number) => {
        setCurrentPage(page);
        fetchFilmsDirected();
    };



    const fetchFilmsDirected = async () => {
        try {
            const start = (currentPage - 1) * countPerPage;
            const params = {
                startIndex: start,
                count: countPerPage,
                directorId: id,
            };

            const response = await axios.get('http://localhost:4941/api/v1/films', {
                params,
            });
            const { films: fetchedFilms} = response.data;
            setFilms(fetchedFilms)
        } catch (error) {
            console.error(error);
        }
    }
    const fetchFilmsReviewed = async () => {
        try {
            const start = (currentPage - 1) * countPerPage;
            const params = {
                startIndex: start,
                count: countPerPage,
                reviewerId: id,
            };

            const response = await axios.get('http://localhost:4941/api/v1/films', {
                params,
            });
            const { films: fetchedFilms} = response.data;
            setFilmsReviewed(fetchedFilms)
        } catch (error) {
            console.error(error);
        }
    }

    const fetchUserDetails = async () => {
        const config = {
            headers: {
                "X-Authorization": localStorage.getItem("token")
            }
        }
        const response = await axios.get(`http://localhost:4941/api/v1/users/${id}`,config)
        setUserDetails([response.data])
    }

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const imageElement = event.target as HTMLImageElement;
        imageElement.src = defaultProfileImage;
    };

    React.useEffect( () => {
        fetchUserDetails()
    }, [])

    React.useEffect( () => {
        fetchFilmsDirected()
        fetchFilmsReviewed()
    }, [currentPage])


    const listFilmsDirected = () => {
        if (films.length === 0) {
            return (
                <div className="row">
                    <div className="col-12 text-center">
                        <p>No Films Directed</p>
                    </div>
                </div>

            )
        }
        return films.map((item: Film) => (
                <div className="col-md-4" key={item.filmId}>
                    <div className="card" style={{ width: '20rem' }}>
                        <img
                            src={`http://localhost:4941/api/v1/films/${item.filmId}/image`}
                            className="card-img-top"
                            alt="..."
                        />
                        <div className="card-body">
                            <h5 className="card-title">{item.title}</h5>
                            <p>Age Rating: {item.ageRating}</p>
                            <p>Genre: {item.genreId}</p>
                            <p>
                                Director: {item.directorFirstName} {item.directorLastName}
                            </p>
                            <p>Rating: {item.rating}</p>
                        </div>
                    </div>
                </div>
        ));
    }

    const listFilmsReviewed = () => {
        if (filmsReviewed.length === 0) {
            return (
                <div className="row">
                    <div className="col-12 text-center">
                        <p>No films Reviewed</p>
                    </div>
                </div>

            )
        }
        return filmsReviewed.map((item: Film) => (

            <div className="col-md-4" key={item.filmId}>
                <div className="card" style={{ width: '20rem' }}>
                    <img
                        src={`http://localhost:4941/api/v1/films/${item.filmId}/image`}
                        className="card-img-top"
                        alt="..."
                    />
                    <div className="card-body">
                        <h5 className="card-title">{item.title}</h5>
                        <p>Age Rating: {item.ageRating}</p>
                        <p>Genre: {item.genreId}</p>
                        <p>
                            Director: {item.directorFirstName} {item.directorLastName}
                        </p>
                        <p>Rating: {item.rating}</p>
                    </div>
                </div>
            </div>
        ));
    }


    if (errorFlag) {
        return (
            <div>
                <h1>Error</h1>
                <div style={{ color: "red" }}>
                    {errorMessage}
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <Navbar />
                {userDetails.map((user: UserReturnWithEmail) => (
                    <div className="container-xxl" key={id}>
                        <div className="container-md">
                            <div className="card" style={{width: '100%'}}>
                                <div className="card-body d-flex flex-column">
                                    <h3 className="card-title">My Profile</h3>
                                    <div className="d-flex">
                                        <div className="fixed-column">
                                            <img
                                                src={`http://localhost:4941/api/v1/users/${id}/image`}
                                                className="card-img-top"
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                }}
                                                onError={handleImageError}
                                            />
                                        </div>
                                        <div className="fixed-column">
                                            <h6>{user.firstName}</h6>
                                            <h6>{user.lastName}</h6>
                                            <h6>{user.email}</h6>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <a href={`/films`} className="btn btn-danger">
                                            Back To Films
                                        </a>
                                        <EditProfile/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3>Films Directed</h3>
                            </div>
                            <div className="row row-cols-1 row-cols-md-3">
                                {(listFilmsDirected())}
                            </div>
                            <div>
                                <h3>Films Reviewed</h3>
                            </div>
                            <div className="row row-cols-1 row-cols-md-3">
                                {(listFilmsReviewed())}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}
export default UserProfile