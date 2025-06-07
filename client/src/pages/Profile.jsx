

import '../styles/Profile.css'
import {NavigationBar} from "../components/NavigationBar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";



export const Profile = ({}) => {


    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const {user, API_URL} = useAuth();


    useEffect(() => {

        fetch(`${API_URL}/profile/fetch/posts/${user.sub}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setPosts(data.posts);
                setLoading(false);
                console.log(data.posts);
            })
            .catch(err => console.log(err));

    }, [])






    return (
        <main className="profile">

            <header>

                <section className={'profile-header'}>

                    <div className="profile-avatar">

                        <img src={'/sigge.jpeg'}
                             style={{
                                 height: '50px',
                                 width: '50px',
                                 borderRadius: '50%',

                             }}
                             draggable={false}
                        />

                    </div>

                    <div className="profile-followers">

                        <div>
                            <p>3</p>
                            <p>Posts</p>
                        </div>

                        <div>
                            <p>10</p>
                            <p>Followers</p>
                        </div>

                        <div>
                            <p>9</p>
                            <p>Following</p>
                        </div>


                        <button>
                            Follow
                        </button>

                    </div>

                </section>

                <div className="profile-bio">

                    <h1
                        style={{
                            textAlign: "left",
                            margin: "10px auto",
                            fontSize: '1.5rem',
                        }}
                    >@lundemo</h1>

                    <p>This is my bio 😩 😜</p>
                </div>

            </header>


            <section className="profile-content-grid">

                {/* Snygga till och bryt ut till komponenter */}

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    (posts.length > 0 ? (
                            posts.map((post) => (
                                <div
                                    onClick={() => navigate(`/${post.poster.username}/${post.id}`)}

                                    key={post.id}>
                                    {post.images[0] && post.images.length > 0 ? (
                                        <img src={post.images[0].url} alt={`Post ${post.id}`} />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No posts yet! Create one</p>
                        ))
                )}

            </section>


            <NavigationBar/>

        </main>

    )
}