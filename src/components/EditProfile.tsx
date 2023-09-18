import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import '../styles/EditProfileDisplay.css';
import {useNavigate} from "react-router-dom";

const EditProfile = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [hasProfilePicture, setHasProfilePicture] = useState(true);

    React.useEffect(() => {
        getProfilePic()
        oldInfo()
    }, []);

    const oldInfo = async () => {
        const config = {
            headers: {
                "X-Authorization": localStorage.getItem("token")
            }
        }

        try {
            const response = await axios.get(
                `http://localhost:4941/api/v1/users/${localStorage.getItem("userId")}`,
                config
            )
            setEmail(response.data.email)
            setFirstName(response.data.firstName)
            setLastName(response.data.lastName)
        } catch (error: any) {
            const statusCode = error.response ? error.response.status : 500;
            setErrorFlag(true);

            if (statusCode === 404) {
                setErrorMessage("Not Found. No user with specified ID.");
            }else if (statusCode === 500) {
                setErrorMessage("Internal Server Error. Please try again later.");
            }
        }
    }

    const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    }

    const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    }

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }
    const handleOldPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setOldPassword(event.target.value);
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setProfileImage(event.target.files[0]);
            handleProfileUpload()
        }
    }

    const getProfilePic = async () => {
        try {
            const responseFindImage = await axios.get(
                `http://localhost:4941/api/v1/users/${localStorage.getItem("userId")}/image`

            )
            setHasProfilePicture(true);
        } catch (error) {
            setHasProfilePicture(false);
        }

    }

    const handleDeleteProfilePicture = async () => {
        const config = {
            headers: {
                "X-Authorization": localStorage.getItem("token")
            }
        }

        try {
            const responseDeleteImage = await axios.delete(
                `http://localhost:4941/api/v1/users/${localStorage.getItem("userId")}/image`,
                config
            )
            setHasProfilePicture(false);
        } catch (error: any) {
            const statusCode = error.response ? error.response.status : 500;
            setErrorFlag(true);

            if (statusCode === 401) {
                setErrorMessage("Unauthorized");
            } else if (statusCode === 403) {
                setErrorMessage("Forbidden. Can not delete another user's profile photo");
            } else if (statusCode === 404) {
                setErrorMessage("Not Found. No such user with ID given");
            } else if (statusCode === 500) {
                setErrorMessage("Internal Server Error. Please try again later.");
            }
        }


    }

    const handleProfileUpload = async () => {
        if (profileImage) {
            const config = {
                headers: {
                    "X-Authorization": localStorage.getItem("token"),
                    "Content-Type": profileImage.type
                }
            };

            try {
                const responseFindImage = await axios.put(
                    `http://localhost:4941/api/v1/users/${localStorage.getItem("userId")}/image`,
                    profileImage,
                    config
                );
                setHasProfilePicture(true);
            } catch (error: any) {
                const statusCode = error.response ? error.response.status : 500;
                setErrorFlag(true);

                if (statusCode === 400) {
                    setErrorMessage("Bad Request. Invalid image supplied (possibly incorrect file type)");
                } else if (statusCode === 401) {
                    setErrorMessage("Unauthorized");
                } else if (statusCode === 403) {
                    setErrorMessage("Forbidden. Can not change another user's profile photo");
                } else if (statusCode === 404) {
                    setErrorMessage("Not found. No such user with ID given");
                } else if (statusCode === 500) {
                    setErrorMessage("Internal Server Error. Please try again later.");
                }
            }
        }
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();


        if (!firstName || !lastName || !email || !password || !oldPassword) {
            setErrorFlag(true);
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        const updatedUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            currentPassword: oldPassword,
            password: password,
        }

        const config = {
            headers: {
                "X-Authorization": localStorage.getItem("token")
            }
        }

        try {
            const response = await axios.patch(
                `http://localhost:4941/api/v1/users/${localStorage.getItem("userId")}`,
                updatedUser, config
            )

            setShowModal(false)
            window.location.reload();

        } catch (error: any) {
            const statusCode = error.response ? error.response.status : 500;
            setErrorFlag(true);

            if (statusCode === 400) {
                setErrorMessage("Bad request. Invalid information");
            } else if (statusCode === 401) {
                setErrorMessage("Unauthorized or Invalid currentPassword");
            } else if (statusCode === 403) {
                setErrorMessage("Forbidden. This is not your account, or the email is already in use, or identical current and new passwords");
            } else if (statusCode === 404) {
                setErrorMessage("Not Found");
            } else if (statusCode === 500) {
                setErrorMessage("Internal Server Error. Please try again later.");
            }
        }
    }

    return (
        <div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Edit Profile
            </button>
            {showModal && (
                <div className="modal" tabIndex={-1} role="dialog" style={{ display: "block"}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content wide-modal">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Profile</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            {errorFlag && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <div className="modal-body">
                                <form onSubmit={handleFormSubmit} className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="firstName"
                                                value={firstName}
                                                onChange={handleFirstNameChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="oldPassword">Old Password:</label>
                                            <input
                                                type="oldPassword"
                                                className="form-control"
                                                id="oldPassword"
                                                value={oldPassword}
                                                onChange={handleOldPasswordChange}
                                                minLength={6}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <div className="form-group">
                                                <label htmlFor="lastName">Last Name:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="lastName"
                                                    value={lastName}
                                                    onChange={handleLastNameChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">New Password:</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                minLength={6}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <div className="row align-items-center">
                                            <div className="col-md">
                                                <label htmlFor="profileImage">Profile Image (optional):</label>
                                            </div>
                                            <div className="col-md">
                                                <input
                                                    type="file"
                                                    className="form-control-file"
                                                    id="profileImage"
                                                    accept=".jpg,.jpeg,.png,.gif"
                                                    onChange={handleProfileImageChange}
                                                />
                                            </div>
                                            <div className="col-md">
                                                {hasProfilePicture && (
                                                    <button type="button" className="btn btn-danger" onClick={handleDeleteProfilePicture}>
                                                        Delete Profile Picture
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ marginTop: '60px' }}
                                            onClick={handleProfileUpload}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            )}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    )
}

export default EditProfile;