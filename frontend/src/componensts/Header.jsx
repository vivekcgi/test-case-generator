
import { Link, NavLink} from 'react-router-dom'
const Header = () => {
  return (
  <>
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-1">
      <div className="container container-fluid">
        <Link className="navbar-brand" to="/">Hero Hack</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink to="/"  className={({ isActive }) => (isActive ? "active  nav-link" : "inactive  nav-link")} >Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/setting" className={({ isActive }) => (isActive ? "active  nav-link" : "inactive  nav-link")} >Setting</NavLink>
            </li>
          </ul>
          <ul className="navbar-nav mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active  nav-link" : "inactive  nav-link")} >Login</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </>
  )
}

export default Header;
