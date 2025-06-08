

import '../../styles/Post.css'
import {Carousel} from "../Carousel.jsx";
import {likePost} from "../../services/helperFunctions.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {UserAvatar} from "../UserAvatar.jsx";
import {useNavigate} from "react-router-dom";
import {CommentCard} from "../CommentSectionComponents/CommentCard.jsx";
import {useState} from "react";

export const Post = ({
                         username = 'Unknown',
                         caption = '',
                         likes = [],
                         comments = [],
                         images = [],
                         id = 0,
                         post = null,
                         poster = null,
                      }) => {



    const {user, API_URL} = useAuth();
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();

    const likePost = async (postID, userID) => {
        try {
            const response = await fetch(`${API_URL}/posts/like/${postID}/${userID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                console.error("HTTP error", response.status, response.statusText);
            } else {
                console.log('Like Post');
            }

        } catch (err) {
            console.error("Network or fetch error:", err);
        }
    }

    return (

        <article className="post">

            <div className='post-header'>

                <UserAvatar/>

                <h2>{post.poster?.username}</h2>

                {/* Här kör vi en userAvatar component*/}

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
                        likePost(id, user.sub)
                    }} className='post-likes'>

                        <span>{likes.length || 0}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#e3e3e3">
                            <path
                                d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                        </svg>
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

                {comments?.length > 0 && (
                    (comments.map(comment => (
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
    )
}