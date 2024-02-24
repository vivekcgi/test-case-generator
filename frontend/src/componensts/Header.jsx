import { Link, NavLink } from "react-router-dom";
const Header = () => {
    const token= localStorage.getItem("token");
    return (
        <>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-1">
                <div className="container container-fluid">
                    {token?
                    <Link className="navbar-brand" to="/home">
                        TestGeni
                    </Link>
                    :
                    <Link className="navbar-brand" to="/">
                        TestGeni
                    </Link>
                    }
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse"
                        aria-controls="navbarCollapse"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {token &&
                    <div
                        className="collapse navbar-collapse"
                        id="navbarCollapse"
                    >
                       <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <NavLink
                                    to="/home"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "active  nav-link"
                                            : "inactive  nav-link"
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/setting"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "active  nav-link"
                                            : "inactive  nav-link"
                                    }
                                >
                                    Setting
                                </NavLink>
                            </li>
                        </ul>
                        :
                        <ul className="navbar-nav mb-2 mb-md-0">
                            <li className="nav-item">
                                <NavLink
                                    onClick={()=>{
                                        localStorage.removeItem("token")
                                        localStorage.removeItem("setting")}}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "active  nav-link"
                                            : "inactive  nav-link"
                                    }
                                >
                                    Logout
                                </NavLink>
                            </li>
                        </ul>
                    </div>
}
                </div>
            </nav>
        </>
    );
};

export default Header;
