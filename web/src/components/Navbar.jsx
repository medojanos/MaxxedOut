import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav className="navbar bg-dark p-3">
            <div className="container-lg">
                <Link to="/" className='navbar-brand'>MaxxedOut</Link>
                <div>
                    <Link to="/about">About</Link>
                </div>
            </div>
        </nav>
    )
}