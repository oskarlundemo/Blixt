import {UserAvatar} from "../UserAvatar.jsx";
import moment from "moment-timezone";
import {useAuth} from "../../context/AuthContext.jsx";
import {useParams} from "react-router-dom";
import {useEffect} from "react";


export const CommentCard = ({
                                comment = '',
                                author = null,
                                timestamp,
                                commentSection = false,
                                id = 0,
                                isUsersPost = false,
                                setComments = [],
                            }) => {

    const {user, API_URL, token} = useAuth();
    const {postid} = useParams();

    const parseTimeStamp = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp);

        const diffInMs = now - created;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 60) {
            if (diffInMinutes <= 0) {
                return 'Just now'
            }
            return `${diffInMinutes} min`;
        } else if (diffInHours < 24) {
            return `${diffInHours} h`;
        } else {
            return `${diffInDays} d`;
        }
    };



    const deleteCommentHandler = async (commentId) => {
        await fetch(`${API_URL}/posts/comments/delete/${commentId}/${postid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
            })
            .catch(err => console.log(err));
    }




    return (
        <div className="comment-card">

            <div className="comment-card__header">

                {commentSection && (
                    <UserAvatar
                        user={author}
                        size={30}
                    />
                )}

                <div className={'comment-info'}>
                    <p>@{author?.username || 'No username'}</p>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}>
                        <p>{parseTimeStamp(timestamp)}</p>


                        {(isUsersPost || author?.id === user?.id) && (
                            <svg
                                className={'delete-comment-icon'}
                                onClick={() => deleteCommentHandler(id)}
                                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-440v-80h560v80H200Z"/></svg>)}

                          </div>

                </div>

            </div>


            <div className="comment-card__body">
                <p>{comment}</p>
            </div>





        </div>
    )
}


