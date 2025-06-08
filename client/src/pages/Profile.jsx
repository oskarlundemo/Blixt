

import '../styles/Profile.css'
import {NavigationBar} from "../components/NavigationBar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {UserAvatar} from "../components/UserAvatar.jsx";



export const Profile = ({}) => {


    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profileUser, setProfileUser] = useState({});

    const { username, uuid } = useParams();

    useEffect(() => {
        console.log("Username:", username);
        console.log("UUID:", uuid);

        // Fetch user data by username or UUID here
    }, [username, uuid]);

    const {API_URL, user} = useAuth();


    useEffect(() => {

        fetch(`${API_URL}/profile/fetch/user/${uuid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setProfileUser(data);
                console.log(data);
            })
            .catch(err => console.log(err));


        fetch(`${API_URL}/profile/fetch/posts/${uuid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setPosts(data.posts);
                console.log(data.posts);
            })
            .catch(err => console.log(err));

    }, [])


    return (
        <main className="profile">

            <header>

                <section className={'profile-header'}>

                    <UserAvatar
                        user={profileUser}
                        height={'50px'}
                        width={'50px'}
                        selectPicture={true}
                    />

                    <div className="profile-followers">

                        <div>
                            <p>{posts.length}</p>
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


                        {!uuid === user.id ? (
                            <button>
                                Follow
                            </button>
                        ) : (
                            <button>
                                Edit
                            </button>
                        )}

                    </div>

                </section>

                <div className="profile-bio">

                    <h1
                        style={{
                            textAlign: "left",
                            margin: "10px auto",
                            fontSize: '1.5rem',
                        }}
                    >@{profileUser.username}</h1>

                    <p>{profileUser.bio}</p>
                </div>

            </header>


            <section className="profile-content-grid">

                {/* Snygga till och bryt ut till komponenter */}

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    (posts.length > 0 ? (
                            posts.map((post) => (
                                <article
                                    onClick={() => navigate(`/${post.poster.username}/${post.id}`)}
                                    key={post.id}>
                                    {post.images[0] && post.images.length > 0 ? (
                                        <img draggable={false} src={post.images[0].url} alt={`Post ${post.id}`} />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                </article>
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