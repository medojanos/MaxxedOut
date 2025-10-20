import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav className="navbar bg-dark p-3">
            <div className="container-lg">
                <Link to="/" className='navbar-brand'>MaxxedOut</Link>
                <div>
                    <Link to="/registration" className='me-5'>Registration</Link>
                    <Link to="/download">Download</Link>
                </div>
            </div>
        </nav>
    )
}