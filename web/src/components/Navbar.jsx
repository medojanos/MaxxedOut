import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar p-3">
            <div className="container-lg">
                <Link to="/"><h3>MaxxedOut</h3></Link>
                <div>
                    <Link to="https://github.com/medojanos/MaxxedOut" className="me-3">GitHub</Link>
                    <Link to="/docs">Docs</Link>
                </div>
            </div>
        </nav>
    )
}