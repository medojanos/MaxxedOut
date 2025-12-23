export default function Footer() {
    return (
        <footer className="container-lg">
            <div className="d-flex justify-content-between">
                <div>
                    <h3>MaxxedOut</h3>
                    <h5>Maxx out your workouts</h5>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <a href="/registration">Registration</a>
                    <a href="/download">Download</a>
                    <a href="/docs">Docs</a>
                    <a href="/delete-account">Delete account</a>
                </div>
            </div>
            <hr/>
            <p>2025 @ MaxxedOut. All rights reserved.</p>
        </footer>
    )
}