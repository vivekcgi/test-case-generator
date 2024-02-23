import { useState } from "react";
import { httpRequest } from "../utils/utils";

const LoginForm = () => {
const [uname, setUname] = useState();
const [password, setPassword] = useState();
const [isLoading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    await httpRequest.post("/api/auth/login",{
        username: uname,
        password: password,
    }).then(function (response) {
        setLoading(false);
        console.log(response);
    })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
    });
}
return (
    <div className="container-xl mt-4">
		<div className="row">
			<div className="card mb-4 bg-light rounded w-75 mx-auto">
				<div className="card-header">Login</div>
                <div className='card-body'>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                        <label htmlFor="exampleInputEmail1">User Name</label>
                        <input type="text" className="form-control" id="userName" aria-describedby="userName" placeholder="Enter user name" value={password} onChange={e => setUname(e.target.value)} required/>
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password" value={password}
                        onChange={e => setPassword(e.target.value)} required/>
                    </div>
                    <div className="form-group mb-4">
                    {isLoading ? (
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Submitting...
                        </button>
                    ) : (
                        <button className="btn btn-primary" type="submit">
                            <span>Submit</span>
                        </button>
                    )}
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LoginForm
