import { NavLink, useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);
    return (
        <>
            <div className="row justify-content-center">
                <div className="col-md-12 col-sm-12">
                    <div className="card shadow-lg border-0 rounded-lg mt-5 mx-auto" style={{width:"30rem"}}>
                        <h3 className="card-header display-1 text-muted text-center" style={{backgroundColor:"white",border:"none"}}>
                            404
                        </h3>

                        <span className="card-subtitle mb-2 text-muted text-center">
                            Page Could Not Be Found 
                        </span>

                        <div className="card-body mx-auto">
                            <NavLink to="/"  className="btn btn-sm btn-info text-white">Back To Home</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ErrorPage;