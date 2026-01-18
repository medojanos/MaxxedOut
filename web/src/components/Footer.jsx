import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="container-lg">
            <div className="d-flex justify-content-between">
                <div>
                    <h3>MaxxedOut</h3>
                    <h5>Maxx out your workouts</h5>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <Link to="/registration">Registration</Link>
                    <Link to="/password-recovery">Password recovery</Link>
                    <Link to="/delete-account">Delete account</Link>
                </div>
            </div>
            <hr/>
            <p>2026 @ MaxxedOut. All rights reserved.</p>
        </footer>
    )
}