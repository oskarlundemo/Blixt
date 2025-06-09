

import '../styles/Profile.css'
import {NavigationBar} from "../components/NavigationBar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {UserAvatar} from "../components/UserAvatar.jsx";
import {BioInput} from "../components/ProfileComponents/BioInput.jsx";
import {ButtonContainer} from "../components/ProfileComponents/ButtonContainer.jsx";



export const Profile = ({}) => {


    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profileUser, setProfileUser] = useState({});
    const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0);

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null); // for visual preview


    const [editedBio, setEditedBio] = useState('');


    const [bioLength, setBioLength] = useState(0);
    const [bio, setBio] = useState("");
    const [username, setUsername] = useState("");


    const [editing, setEditing] = useState(false);
    const { uuid } = useParams();

    const {API_URL, user} = useAuth();

    useEffect(() => {

        fetch(`${API_URL}/profile/fetch/data/${uuid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setProfileUser(data.user);
                setBio(data.user.bio);
                setEditedBio(data.user.bio);
                setUsername(data.user.username);
                setPosts(data.posts);
                setFollowing(data.followers.length);
                setFollowers(data.following.length);
            })
            .catch(err => console.log(err));
    }, [])


    useEffect(() => {
        setBioLength(editedBio ? editedBio.length : 0);
    }, [editedBio]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setBio(editedBio);
        console.log(editedBio);

        console.log(bio);
        console.log('Submitting changes')

        console.log(avatar);

        const formData = new FormData();
        formData.append("bio", bio);
        formData.append("avatar", avatar);


        try {
            await fetch(`${API_URL}/users/update/profile/${uuid}/${user.id}`, {
                method: "POST",
                body: formData
            })

        } catch (err) {
            console.error('Error' + err);
        }


    }



    return (
        <main className="profile">

            <header>

                <section className={'profile-header'}>

                    <UserAvatar
                        user={profileUser}
                        size="100px"
                        selectPicture={true}
                        setEdit={setEditing}
                        setFile={(file) => {
                            setAvatar(file);
                            setAvatarPreview(URL.createObjectURL(file));
                        }}
                        file={avatarPreview}
                    />

                    <div className="profile-followers">

                        <div>
                            <p>{posts.length}</p>
                            <p>Posts</p>
                        </div>

                        <div>
                            <p>{followers}</p>
                            <p>Followers</p>
                        </div>

                        <div>
                            <p>{following}</p>
                            <p>Following</p>
                        </div>

                        {!uuid === user.id ? (
                            <button>
                                Follow
                            </button>
                        ) : (

                            (editing ? (

                                <ButtonContainer
                                    handleSubmit={handleSubmit}
                                    setEditing={setEditing}
                                />

                            ) : (

                                <button
                                    onClick={() => setEditing(true)}
                                    className="edit-button">
                                    Edit
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                                </button>
                            ))
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
                    >@{username}</h1>

                    {editing ? (
                        <BioInput
                            editedBio={editedBio}
                            bio={bio}
                            setEditedBio={setEditedBio}
                            bioLength={bioLength}
                        />
                    ) : (
                        <p>{bio || 'No bio yet'}</p>
                    )}

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