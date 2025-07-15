import '../styles/Profile.css'
import {NavigationBar} from "../components/NavigationBar.jsx";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {UserAvatar} from "../components/UserAvatar.jsx";
import {BioInput} from "../components/ProfileComponents/BioInput.jsx";
import {ButtonContainer} from "../components/ProfileComponents/ButtonContainer.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {FollowMessageContainer} from "../components/ProfileComponents/FollowMessageContainer.jsx";
import {HeaderMenu} from "../components/HeaderMenu.jsx";
import {Overlay} from "../components/Overlay.jsx";
import {BottomSheet} from "../components/BottomSheet.jsx";
import {MenuItem} from "../components/ConversationComponents/MenuItem.jsx";
import {ProfileStat} from "../components/ProfileComponents/ProfileStat.jsx";
import {ErrorMessage} from "../components/ErrorMessage.jsx";
import {PostGrid} from "../components/ProfileComponents/PostGrid.jsx";
import toast from "react-hot-toast";
import {Spinner} from "../components/Spinner.jsx";


/**
 * This component is rendered when a user inspects another users
 * profile or their own
 *
 * @returns {JSX.Element}
 * @constructor
 */




export const Profile = ({}) => {

    const navigate = useNavigate(); // Hook used for navigation
    const [posts, setPosts] = useState([]); // State to hold the posts on the profile
    const [archive, setArchive] = useState([]); // State to hold the archived posts
    const [loading, setLoading] = useState(true); // Loading state
    const [profileUser, setProfileUser] = useState([]); // The user object of the profile
    const [showMore, setShowMore] = useState(false); // State to show settings
    const [conversationId, setConversationId] = useState(null); // State to set the conversation id
    const [isOwnProfile, setIsOwnProfile] = useState(false); // State to check if the profile is the logged-in users

    const [following, setFollowing] = useState(0); // Number of people they are following
    const [followers, setFollowers] = useState(0); // Numbers of followers

    const [follows, setFollows] = useState(false); // Check if the logged-in user follow this profile

    const [avatar, setAvatar] = useState(null); // State to hold the avatar
    const [avatarPreview, setAvatarPreview] = useState(null); // State to change avatar

    const [editedBio, setEditedBio] = useState(''); // State to edit bio

    const [bioLength, setBioLength] = useState(0); // Length of bio
    const [bio, setBio] = useState(""); // The bio loaded on mount
    const [profileUsername, setProfileUsername] = useState(""); // The name of the profile
    const [error, setError] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const [active, setActive] = useState('posts') // Ref used for UI slider
    const postsRef = useRef('posts'); // Ref used for UI slider
    const archiveRef = useRef(null); /**/
    const sliderRef = useRef(null); /**/

    const [editing, setEditing] = useState(false); // State to check if the user is editing the profile
    const { username } = useParams(); // Get username from params
    const decodedUsername = decodeURIComponent(username); // Decode it
    const {API_URL, user, token, logout} = useAuth(); // Token from context


    // This hook runs and updates the position of the slider beneath the public or archived posts
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

    // This hook runs when a profile is loaded and fetches the data
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
                setConversationId(data.conversationId);

                setFollowing(data.following.length);
                setFollowing(data.following?.length || 0);
                setFollowers(data.followers?.length || 0);

                const isFollowing = data.followers?.some(follower => follower.follower_id === user.id) || false;

                setFollows(isFollowing);
                setLoading(false);

            })
            .catch(err => {
                console.log(err)
                setLoading(false);
                setError(true);
            });
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


    const initiateConversation = async () => {
        setSpinner(true);

        try {
            const response = await fetch(`${API_URL}/profile/initiate/conversation/${username}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            if (!response.ok) {
                toast.error('There was an error while loading the conversation');
                return;
            }
            const data = await response.json();
            navigate(`/messages/${data.conversationId}`);
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSpinner(false);
        }
    };

    return (
        <main className="profile">

            {!error && (
                <HeaderMenu
                    newMessage={false}
                    more={true}
                    setShowMore={setShowMore}
                />
            )}

            {spinner && (
                <Spinner />
            )}

            {/* Error and Loading States */}
            {error ? (
                <ErrorMessage
                    message="Failed to load profile."
                    svg={
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                    }
                />
            ) : loading ? (
                <LoadingTitle />
            ) : (
                <section className="profile-wrapper">

                    {/* Profile Header Section */}
                    <section className="profile-header-container">
                        <section className="profile-header">

                            <UserAvatar
                                user={profileUser}
                                autoSize="15vw"
                                selectPicture={true}
                                setEdit={setEditing}
                                setFile={(file) => {
                                    setAvatar(file);
                                    setAvatarPreview(URL.createObjectURL(file));
                                }}
                                file={avatarPreview}
                            />

                            {/* Follower/Following Info & Action Buttons */}
                            <div className="profile-followers">
                                <ProfileStat label="Posts" value={posts.length} />
                                <ProfileStat label="Followers" value={followers} />
                                <ProfileStat label="Following" value={following} />

                                {!isOwnProfile ? (
                                    <FollowMessageContainer
                                        username={profileUsername}
                                        follows={follows}
                                        conversationId={conversationId}
                                        handleFollow={handleFollow}
                                        initiateConversation={initiateConversation}
                                    />
                                ) : (
                                    editing ? (
                                        <ButtonContainer
                                            handleSubmit={handleSubmit}
                                            setEditing={setEditing}
                                        />
                                    ) : (
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="edit-button">
                                            Edit
                                        </button>
                                    )
                                )}
                            </div>
                        </section>

                        {/* Bio Section */}
                        <div className="profile-bio">
                            <h1 className="profile-username">@{username}</h1>
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

                        {/* Posts/Archive Toggle (if own profile) */}
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

                    {/* Posts or Archive Section */}
                    <section className="profile-content-grid">
                        {active === 'posts' ? (
                            <PostGrid posts={posts} emptyMessage="No public posts" />
                        ) : (
                            <PostGrid posts={archive} emptyMessage="No archived posts" />
                        )}
                    </section>
                </section>
            )}

            {/* BottomSheet Menu */}
            <BottomSheet
                showMenu={showMore}
                setShowMenu={setShowMore}
                clickMore={() => setShowMore(true)}
                childrenElements={
                    <MenuItem
                        title="Logout"
                        svg={
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                        }
                        showDropDown={() => {
                            logout();
                            navigate('/');
                        }}
                    />
                }
            />

            {/* Overlay and Navigation */}
            <Overlay
                showOverlay={showMore}
                setShowOverlay={setShowMore}
                clickToggle={true}
            />
            <NavigationBar />
        </main>
    );

}