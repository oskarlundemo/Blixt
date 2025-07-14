import { HeaderMenu } from "../components/HeaderMenu.jsx";
import { Link } from "react-router-dom";
import '../styles/NoHit.css';
import {useAuth} from "../context/AuthContext.jsx";

export const NotFound = () => {

    const {user} = useAuth();

    return (
        <main className="no-hit">

            <section className="no-hit-content">
                <div className="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" height="80px" viewBox="0 -960 960 960" width="80px" fill="#e3e3e3">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                    </svg>
                </div>

                <h1>Oops! Page not found</h1>
                <p>We couldn't find the page you're looking for. It may have been moved or deleted.</p>

                <div className="no-hit-actions">
                    {user && user.id ? (
                        <Link to="/feed" className="no-hit-button">Go Home</Link>
                    ) : (
                        <Link to="/" className="no-hit-button">Go Home</Link>
                    )}
                </div>

            </section>
        </main>
    );
}