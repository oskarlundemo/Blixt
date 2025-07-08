

import '../styles/Profile.css'
import {NavigationBar} from "../components/NavigationBar.jsx";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {UserAvatar} from "../components/UserAvatar.jsx";
import {BioInput} from "../components/ProfileComponents/BioInput.jsx";
import {ButtonContainer} from "../components/ProfileComponents/ButtonContainer.jsx";
import {LoadingBox} from "../components/LoadingBox.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {FollowMessageContainer} from "../components/ProfileComponents/FollowMessageContainer.jsx";
import {HeaderMenu} from "../components/HeaderMenu.jsx";
import {Overlay} from "../components/Overlay.jsx";
import {BottomSheet} from "../components/BottomSheet.jsx";
import {MenuItem} from "../components/ConversationComponents/MenuItem.jsx";



export const Profile = ({}) => {


    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileUser, setProfileUser] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0);

    const [follows, setFollows] = useState(false);

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [editedBio, setEditedBio] = useState('');

    const [bioLength, setBioLength] = useState(0);
    const [bio, setBio] = useState("");
    const [profileUsername, setProfileUsername] = useState("");

    const [active, setActive] = useState('posts')
    const postsRef = useRef('posts');
    const archiveRef = useRef(null);
    const sliderRef = useRef(null);

    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
        const updateSlider = () => {
            const target = active === 'posts' ? postsRef.current : archiveRef.current;
            if (target && sliderRef.current) {
                sliderRef.current.style.width = `${target.offsetWidth}px`;
                sliderRef.current.style.left = `${target.offsetLeft}px`;
            }
        };

        requestAnimationFrame(updateSlider);
        window.addEventListener('resize', updateSlider);

        return () => {
            window.removeEventListener('resize', updateSlider);
        };
    }, [active]);


    const [editing, setEditing] = useState(false);
    const { username } = useParams();
    const decodedUsername = decodeURIComponent(username);

    const {API_URL, user, token, logout} = useAuth();

    useEffect(() => {

        setLoading(true);

        fetch(`${API_URL}/profile/fetch/data/${encodeURIComponent(decodedUsername)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {

                setProfileUser(data.user);
                setBio(data.user?.bio || '');
                setEditedBio(data.user.bio);
                setProfileUsername(data.user.username || data.user.user_metadata.username);
                setPosts(data.posts);
                setArchive(data.archive);

                setFollowing(data.following.length);
                setFollowing(data.following?.length || 0);
                setFollowers(data.followers?.length || 0);

                const isFollowing = data.followers?.some(follower => follower.follower_id === user.id) || false;

                setFollows(isFollowing);
                setLoading(false);

            })
            .catch(err => console.log(err));
    }, [username])

    useEffect(() => {
        setIsOwnProfile(user?.id === profileUser?.id);
    }, [user, profileUser, username]);


    useEffect(() => {
        setBioLength(editedBio ? editedBio.length : 0);
    }, [editedBio]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setBio(editedBio);

        const formData = new FormData();
        formData.append("bio", editedBio);
        formData.append("avatar", avatar);

        try {
            await fetch(`${API_URL}/users/update/profile`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (err) {
            console.error('Error' + err);
        }
    }


    const handleFollow = async (e) => {
        try {
            await fetch(`${API_URL}/profile/follow/${profileUser.id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
                .then(res => res.json())
                .then(data => {
                    setFollows(data.follows);
                    setFollowers(data.unfollowed ? followers -1  : followers + 1)
                })
                .catch(err => console.log(err));

        } catch (err) {
            console.error('Error' + err);
        }
    }


    return (
        <main className="profile">

            <HeaderMenu
                newMessage={false}
                more={true}
                setShowMore={setShowMore}
            />

            {loading ? (
                <LoadingTitle/>
            ) : (
                <section className="profile-wrapper">
                    <section className="profile-header-container">

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

                            {!isOwnProfile ? (
                                <FollowMessageContainer
                                    username={profileUsername}
                                    follows={follows}
                                    handleFollow={handleFollow}/>
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
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <h1
                                style={{
                                    textAlign: "left",
                                    margin: "10px auto",
                                    fontSize: '1.5rem',
                                }}
                            >@{username}</h1>
                        )}

                        {editing ? (
                            <BioInput
                                editedBio={editedBio}
                                bio={bio}
                                setEditedBio={setEditedBio}
                                bioLength={bioLength}
                            />
                        ) : (
                            <p>{bio}</p>
                        )}
                    </div>


                    {isOwnProfile && (
                        <div className="archive-container">
                            <div className="button-container">
                                <button ref={postsRef} onClick={() => setActive('posts')}>Posts</button>
                                <button ref={archiveRef} onClick={() => setActive('archive')}>Archive</button>
                            </div>

                            <div className="active-slider-container">
                                <div className="active-slider" ref={sliderRef}></div>
                            </div>
                        </div>
                    )}

                </section>

                <section className="profile-content-grid">

            {/* Snygga till och bryt ut till komponenter */}

                {active === 'posts' ? (
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
                        <p
                            style={{
                                textAlign: "center",
                                position: "relative",
                                gridArea:  "1 / 2 / 2 / 2"
                            }}
                        >No public posts</p>
                    ))
                ) : (
                    (archive.length > 0 ? (
                        archive.map((post) => (
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
                        <p
                            style={{
                                textAlign: "center",
                                position: "relative",
                                gridArea:  "1 / 2 / 2 / 2"
                            }}
                        >No archived posts</p>
                    ))
                )}
                </section>
                </section>
            )}

            <BottomSheet
                showMenu={showMore}
                setShowMenu={setShowMore}
                clickMore={() => setShowMore(true)}
                childrenElements={

                <MenuItem
                    title={'Logout'}
                    svg={
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                    }
                    showDropDown={() => {
                        logout();
                        navigate('/');
                    }}
                />
            }/>

            <Overlay
                showOverlay={showMore}
                setShowOverlay={setShowMore}
                clickToggle={true}/>

            <NavigationBar/>
        </main>
    )
}