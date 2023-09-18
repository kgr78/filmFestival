import axios from 'axios';
import React, {ChangeEvent, useState, useEffect} from "react";
import '../styles/filmsDisplay.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Navbar from "./Navbar";
import defaultProfileImage from "./logo192.png";

const Films = () => {
    const [films, setFilms] = React.useState < Film[] > ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [sortOption, setSortOption] = React.useState('RELEASED_ASC');
    const [selectedAgeRatings, setSelectedAgeRatings] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [availableGenres, setAvailableGenres] = useState<{ id: number; name: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const countPerPage = 6;



    const handlePageClick = (page: number) => {
        setCurrentPage(page);
        fetchFilms();
    };

    const handleSortChange = (option: string) => {
        setSortOption(option);
        setCurrentPage(1);
        fetchFilms();
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        setCurrentPage(1);
        fetchFilms();
    };

    const mapGenres = (genresData: any[]): { id: number; name: string }[] => {
        return genresData.map((genre) => ({
            id: genre.genreId,
            name: genre.name,
        }));
    };

    const fetchFilms = async () => {
        try {
            const start = (currentPage - 1) * countPerPage;
            const params = {
                startIndex: start,
                count: countPerPage,
                sortBy: sortOption,
                genreIds: selectedGenres.length > 0 ? selectedGenres : undefined,
                ageRatings: selectedAgeRatings.length > 0 ? selectedAgeRatings : undefined,
                q: searchQuery || undefined,
            };

            const response = await axios.get('http://localhost:4941/api/v1/films', {
                params,
            });

            const { films: fetchedFilms, count: fetchedCount } = response.data;
            const sortedFilms = sortFilms(fetchedFilms, sortOption);
            setFilms(sortedFilms);
            setTotalCount(fetchedCount);
            setTotalPages(Math.ceil(fetchedCount / countPerPage));

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
    };

    const sortFilms = (films: Film[], sortOption: string): Film[] => {
        // Implement the sorting logic based on the sortOption
        switch (sortOption) {
            case 'ALPHABETICAL_ASC':
                return [...films].sort((a, b) => a.title.localeCompare(b.title));
            case 'ALPHABETICAL_DESC':
                return [...films].sort((a, b) => b.title.localeCompare(a.title));
            case 'RELEASED_ASC':
                return [...films].sort(
                    (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
                );
            case 'RELEASED_DESC':
                return [...films].sort(
                    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
                );
            case 'RATING_ASC':
                return [...films].sort((a, b) => a.rating - b.rating);
            case 'RATING_DESC':
                return [...films].sort((a, b) => b.rating - a.rating);
            default:
                return films;
        }
    };

    React.useEffect(() => {
        fetchFilms()
    }, [currentPage, sortOption, selectedGenres, selectedAgeRatings, searchQuery])

    React.useEffect(() => {
        fetchGenres();
    }, []);


    const handleAgeRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (selectedAgeRatings.includes(value)) {
            setSelectedAgeRatings(selectedAgeRatings.filter((rating) => rating !== value));
        } else {
            setSelectedAgeRatings([...selectedAgeRatings, value]);
        }
    }

    const handleGenreChange = (event: ChangeEvent<HTMLInputElement>) => {
        const genreId = parseInt(event.target.value);

        if (!isNaN(genreId)) {
            const updatedGenres = selectedGenres.includes(genreId)
                ? selectedGenres.filter((id) => id !== genreId)
                : [...selectedGenres, genreId];

            setSelectedGenres(updatedGenres);
        } else {
            console.error('Invalid genre ID:', event.target.value);
        }
    };

    const filterByGenres = () => {
        return (
            <div className="dropdown">
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="genreDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Filter By Genre
                </button>
                <ul className="dropdown-menu" aria-labelledby="genreDropdown">
                    {availableGenres.map((genre) => (
                        <li key={genre.id}>
                            <label className="dropdown-item">
                                <input
                                    type="checkbox"
                                    value={genre.id}
                                    checked={selectedGenres.includes(genre.id)}
                                    onChange={handleGenreChange}
                                />{" "}
                                {genre.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const filterByAge = () => {
        const ageRatings = ["G", "PG", "M", "R13", "R16", "R18"];

        return (
            <div className="dropdown">
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="filterDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Filter By Age Rating
                </button>
                <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                    {ageRatings.map((rating) => (
                        <li key={rating}>
                            <label className="dropdown-item">
                                <input
                                    type="checkbox"
                                    value={rating}
                                    checked={selectedAgeRatings.includes(rating)}
                                    onChange={handleAgeRatingChange}
                                />{" "}
                                {rating}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const paginationCreation = () => {
        if (totalPages === 0) {
            return null;
        }
        const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
        const MAX_VISIBLE_PAGES = 5; // Maximum number of visible page numbers

        const getPageNumbers = () => {
            if (totalPages <= MAX_VISIBLE_PAGES) {
                return pageNumbers;
            }

            const offset = Math.max(currentPage - Math.floor(MAX_VISIBLE_PAGES / 2), 1);
            const end = Math.min(offset + MAX_VISIBLE_PAGES - 1, totalPages);

            if (end - offset < MAX_VISIBLE_PAGES - 1) {
                const diff = MAX_VISIBLE_PAGES - 1 - (end - offset);
                return pageNumbers.slice(0, MAX_VISIBLE_PAGES - 1).concat([...Array(diff).fill(null), totalPages]);
            }

            return pageNumbers.slice(offset - 1, end);
        };

        return (
            <nav>
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageClick(1)}>
                            First
                        </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(currentPage - 1)}
                        >
                            Previous
                        </button>
                    </li>

                    {getPageNumbers().map((page, index) =>
                        page ? (
                            <li
                                key={page}
                                className={`page-item ${currentPage === page ? 'active' : ''}`}
                            >
                                <button className="page-link" onClick={() => handlePageClick(page)}>
                                    {page}
                                </button>
                            </li>
                        ) : (
                            <li key={`ellipsis-${index}`} className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )
                    )}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(currentPage + 1)}
                        >
                            Next
                        </button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageClick(totalPages)}>
                            Last
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const imageElement = event.target as HTMLImageElement;
        imageElement.src = defaultProfileImage;
    };

    const list_of_films = () => {
        if (films.length === 0) {
            return <p>No films found.</p>;
        }
        return films.map((item: Film) => {
            const genre = availableGenres.find((genre) => genre.id === item.genreId)
            return (
                <div className="col-md-4" key={item.filmId}>
                    <div className="card" style={{ width: '20rem' }}>
                        <img
                            src={`http://localhost:4941/api/v1/films/${item.filmId}/image`}
                            className="card-img-top"
                            alt="..."
                            onError={handleImageError}
                        />
                        <div className="card-body">
                            <h5 className="card-title">{item.title}</h5>
                            <p>Age Rating: {item.ageRating}</p>
                            <p>Genre: {genre ? genre.name : 'Unknown'}</p>
                            <img
                                src={`http://localhost:4941/api/v1/users/${item.directorId}/image`}
                                alt="..."
                                className="card-img-top"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                                onError={handleImageError}
                            />
                            <p>
                                {item.directorFirstName} {item.directorLastName}
                            </p>
                            <p>Rating: {item.rating}</p>
                            <a href={`/films/` + item.filmId} className="btn btn-primary">
                                See more
                            </a>

                        </div>
                    </div>
                </div>
            )})
    }

    const searchBar = () => {
        return (
            <div className="form-outline">
                <input type="search" id="form1" className="form-control" placeholder="Search For a Film ..."
                    aria-label="Search" onChange={handleSearch}/>
            </div>
        )
    }

    const sortBy = () => {
        return (<div className="dropdown">
            <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="sortDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Sort By
            </button>
            <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                <li>
                    <button
                        className="dropdown-item"
                        onClick={() => handleSortChange('RELEASED_ASC')}
                    >
                        Release Date (Oldest-Newest)
                    </button>
                </li>
                <li>
                    <button
                        className="dropdown-item"
                        onClick={() => handleSortChange('RELEASED_DESC')}
                    >
                        Release Date (Newest-Oldest)
                    </button>
                </li>
                <li>
                    <button
                        className="dropdown-item"
                        onClick={() => handleSortChange('ALPHABETICAL_ASC')}
                    >
                        Alphabetical (A-Z)
                    </button>
                </li>
                <li>
                    <button
                        className="dropdown-item"
                        onClick={() => handleSortChange('ALPHABETICAL_DESC')}
                    >
                        Alphabetical (Z-A)
                    </button>
                </li>
                <li>
                    <button
                        className="dropdown-item"
                        onClick={() => handleSortChange('RATING_ASC')}
                    >
                        Rating (Low-High)
                    </button>
                </li>
                <li>
                    <button
                        className="dropdown-item"
                        onClick={() => handleSortChange('RATING_DESC')}
                    >
                        Rating (High-Low)
                    </button>
                </li>
            </ul>
        </div>)
    }

    if (errorFlag) {
        return (
            <div>
                <h1>Error</h1>
                <div style={{ color: "red" }}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <Navbar />
                <div className="container-xxl">

                    <div className="container-md ">
                        <h1>All Films</h1>
                        {searchBar()}
                        <div className="row row-cols-1 row-cols-md-3">
                            {sortBy()}
                            {filterByAge()}
                            {filterByGenres()}
                        </div>

                        <div className="row row-cols-1 row-cols-md-3">
                            {(list_of_films())}
                        </div>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-center">
                                {paginationCreation()}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                </div>
            </div>
        )
    }
}
export default Films;
