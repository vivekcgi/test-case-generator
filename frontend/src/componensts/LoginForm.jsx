import { useState } from "react";
import { httpRequest } from "../utils/utils";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const LoginForm = () => {
    const [uname, setUname] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await httpRequest
            .post("/api/auth/login", {
                username: uname,
                password: password,
            })
            .then(function (response) {
                setLoading(false);
                toast.success(' Login successful!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                navigate('/home');
                localStorage.setItem("token", response.data.data.access_token);
                console.log(response);
            })
            .catch(function (error) {
                setLoading(false);
                toast.error('Login failed!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                console.log(error);
            });
    };
    return (
        <div className="container-xl mt-4">
            <div className="row">
                <div className="card mb-4 bg-light rounded w-75 mx-auto">

                                        <div className="card-header">Login</div>
                    <div className="card-body">
                    <ToastContainer />
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputEmail1">
                                    User Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="userName"
                                    aria-describedby="userName"
                                    placeholder="Enter user name"
                                    value={uname}
                                    onChange={(e) => setUname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group mb-4">
                                {isLoading ? (
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        disabled
                                    >
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Submitting...
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        <span>Submit</span>
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
