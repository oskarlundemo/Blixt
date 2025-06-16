

import '../../styles/Post.css'
import {Carousel} from "../Carousel.jsx";
import {likePost} from "../../services/helperFunctions.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {UserAvatar} from "../UserAvatar.jsx";
import {useNavigate} from "react-router-dom";
import {CommentCard} from "../CommentSectionComponents/CommentCard.jsx";
import {useEffect, useState} from "react";
import {BottomMenu} from "../BottomMenu.jsx";
import {Overlay} from "../Overlay.jsx";

export const Post = ({
                         username = 'Unknown',
                         caption = '',
                         likes = [],
                         comments = [],
                         images = [],
                         id = 0,
                         post = null,
                         poster = null,
                         setPosts = [],
                      }) => {


    const {user, API_URL, token} = useAuth();
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();
    const [testLikes, setLikes] = useState(likes);
    const [renderedIndex, setRenderedIndex] = useState(5);
    const [showBottomMenu, setShowBottomMenu] = useState(false);


    useEffect(() => {
        if (user) {
            const hasLiked = likes.some(like => like.user_id === user.id);
            setLiked(hasLiked);
        }
    }, [likes, user]);


    const likePostHandler = async (postID, userID) => {

       if (!postID || !userID || isNaN(Number(postID))) {
            console.warn("Invalid postID or userID");
            return;
        }

        try {
           await fetch(`${API_URL}/posts/like/${postID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then((data) => {
                    setLiked(data.liked);
                    setLikes(data.likes);
                })
                .catch((err) => {
                    console.error(err);
                })

        } catch (err) {
            console.error("Network or fetch error:", err);
        }
    };


    return (

        <>

        <article className="post">

            <div
                className='post-header'>

                <UserAvatar
                    user={poster}
                    size={'30px'}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                    }}
                >

                    <h2
                        onClick={() => {
                            navigate(`/${encodeURIComponent(post.poster?.username)}`)
                        }}

                        className={'username-title'}

                        style={{
                            cursor: 'pointer',
                        }}
                    >{post.poster?.username}</h2>


                    {post.poster?.id === user.id && (
                        <svg
                            style={{
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                setShowBottomMenu(true);
                            }}
                            xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
                    )}

                </div>

            </div>

            <div className='post-body'>

                {images.length > 1 ? (
                    <Carousel>
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={`Image ${index}`}
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        ))}
                    </Carousel>
                ) : (
                    <img
                        src={images[0].url}
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                )}


            </div>


            <div className='post-footer'>

                <div className='post-interactions'>

                    <div onClick={() => {
                        likePostHandler(id, user.sub)
                    }} className='post-likes'>

                        <span>{testLikes.length || 0}</span>

                        {liked ? (
                            <svg
                                style={{
                                    fill: "red",
                                    transition: '200ms ease-in-ease-out',
                                }}

                                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                 fill="#e3e3e3">
                                <path
                                    d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                        ) : (
                            <svg
                                style={{
                                    transition: '200ms ease-in-ease-out',
                                }}

                                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                 fill="#e3e3e3">
                                <path
                                    d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                            </svg>
                        )}

                    </div>


                    <div
                        onClick={() => navigate(`/${post.poster.username}/${post.id}/comments`)}
                        className='post-comments'>
                        <span>{comments.length || 0}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#e3e3e3">
                            <path
                                d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/>
                        </svg>
                    </div>

                </div>

                <p>{username}: {caption}</p>

                {comments?.length < renderedIndex ? (
                    (comments.map(comment => (
                        <CommentCard
                            key={comment.id}
                            comment={comment.comment}
                            timestamp={comment.created_at ? comment.created_at : undefined}
                            author={comment.user || null}
                        />
                    )))
                ) : (
                    (comments.slice(0, renderedIndex).map(comment => (
                        <CommentCard
                            key={comment.id}
                            comment={comment.comment}
                            timestamp={comment.created_at ? comment.created_at : undefined}
                            user={comment.user || null}
                        />
                    )))
                )}

            </div>

        </article>

            {post.poster?.id === user.id && (
                <>
                <BottomMenu
                    setPosts={setPosts} archived={post.archived}
                    showBottomMenu={showBottomMenu} setShowBottomMenu={setShowBottomMenu}
                    postID={id}
                />

                <Overlay
                setShowOverlay={setShowBottomMenu} clickToggle={true} showOverlay={showBottomMenu}/>
                </>
            )}
        </>
    )
}


export const parseTimeStamp = (timestamp) => {


    const now = new Date();
    const created = new Date(timestamp);

    const diffInMs = now - created;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInMinutes < 60) {
        return `${diffInMinutes} min`;
    } else if (diffInHours < 24) {
        return `${diffInHours} h`;
    } else if (diffInDays <= 7) {
        return `${diffInDays} d`;
    } else {
        return `${diffInWeeks} w`;
    }
}