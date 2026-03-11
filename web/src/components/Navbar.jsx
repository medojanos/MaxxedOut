import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar p-3">
            <div className="container-lg p-2">
                <Link to="/"><h3 id="brand">MaxxedOut</h3></Link>
                <div>
                    <Link to="https://github.com/medojanos/MaxxedOut" target="_blank">GitHub</Link>
                    <Link to="/changelog" className="mx-3">Change Log</Link>
                    <Link to="/docs">Docs</Link>
                </div>
            </div>
        </nav>
    )
}