import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function Profile() {
    const { user } = useContext(UserContext);
    const [userData, setUserData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        contactNumber: "",
    });

    const [passwordData, setPasswordData] = useState({
        password: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    
    const fetchUserDetails = () => {
        fetch("http://localhost:4000/users/details", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((result) => result.json())
            .then((data) => {
                if (data.result) {
                    setUserData(data.result);
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "Unable to fetch user details",
                        icon: "error",
                    });
                }
            });
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    
    const saveDetails = (e) => {
        e.preventDefault();

        fetch("http://localhost:4000/users/update-profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(userData),
        })
            .then((result) => result.json())
            .then((data) => {
                if (data.code === "PROFILE-UPDATED") {
                    Swal.fire({
                        title: "Success!",
                        text: "Profile updated successfully",
                        icon: "success",
                    });
                    setIsEditing(false);
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: data.message || "Unable to update profile",
                        icon: "error",
                    });
                }
            });
    };

    
    const changePassword = (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire({
                title: "Error!",
                text: "New password and confirm password do not match.",
                icon: "error",
            });
            return;
        }

        fetch("http://localhost:4000/users/update-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(passwordData),
        })
            .then((result) => result.json())
            .then((data) => {
                if (data.code === "PASSWORD-UPDATED") {
                    Swal.fire({
                        title: "Success!",
                        text: "Password changed successfully",
                        icon: "success",
                    });
                    setPasswordData({
                        password: "",
                        newPassword: "",
                        confirmPassword: "",
                    });
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: data.message || "Unable to change password.",
                        icon: "error",
                    });
                }
            });
    };

    return (
        <Container style={{ minHeight: "80vh", marginTop: "50px" }} className="p-5 d-flex flex-column align-items-center justify-content-center">
            <h1 className="display-4 fw-bold mb-4">User Profile</h1>
            <Form
                className="w-50 shadow p-5 rounded-3 border-bottom border-3 border-warning"
                onSubmit={saveDetails}
            >
                <Form.Group className="mb-3" controlId="profileFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={userData.firstName}
                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                        disabled={!isEditing}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="profileMiddleName">
                    <Form.Label>Middle Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={userData.middleName}
                        onChange={(e) => setUserData({ ...userData, middleName: e.target.value })}
                        disabled={!isEditing}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="profileLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={userData.lastName}
                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                        disabled={!isEditing}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="profileEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        disabled={!isEditing}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="profileContactNumber">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                        type="text"
                        value={userData.contactNumber}
                        onChange={(e) =>
                            setUserData({ ...userData, contactNumber: e.target.value })
                        }
                        disabled={!isEditing}
                    />
                </Form.Group>
                <Button
                    className="w-100"
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                    style={{ display: isEditing ? "none" : "block" }}
                    >
                    Edit Profile
                </Button>
                <Form.Group>
                    
                </Form.Group>

                <Row>
                    <Col>
                        {isEditing ? (
                            <>
                                <Button 
                                    className="w-100 mb-2" 
                                    type="submit" 
                                    variant="success">
                                    Save Changes
                                </Button>
                                <Button
                                    className="w-100"
                                    variant="secondary"
                                    onClick={() => {
                                        fetchUserDetails();
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                
                            </>
                        )}
                    </Col>
                </Row>

            </Form>
            <Form
                className="w-50 mt-4 shadow p-4 rounded-3 border-top border-3 border-danger"
                onSubmit={changePassword}
            >
                <h4 className="text-center mb-4">Change Password</h4>
                <Form.Group className="mb-3" controlId="currentPassword">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={passwordData.password}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, password: e.target.value })
                        }
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        required
                    />
                </Form.Group>
                <Button className="w-100" type="submit" variant="danger">
                    Update Password
                </Button>
            </Form>
        </Container>
    );
}
