import {useEffect, useRef, useState} from "react";
import '../styles/CommentSection.css'
import {CommentInput} from "../components/CommentSectionComponents/CommentInput.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {CommentCard} from "../components/CommentSectionComponents/CommentCard.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {ErrorMessage} from "../components/ErrorMessage.jsx";


/**
 * This page/component is rendered when a user wants to read all the comments
 * that a post has
 *
 * @returns {JSX.Element}
 * @constructor
 */



export const CommentSection = ({}) => {

    const {token, API_URL} = useAuth(); // Get token from context
    const [comments, setComments] = useState([]); // State to hold the comment
    const {postid} = useParams(); // Get the id of the post from the url
    const navigate = useNavigate(); // Used for navigation
    const [error, setError] = useState(false); // Set error

    const bottomRef = useRef(null); // Scroll to bottom of comments if there are several
    const [loading, setLoading] = useState(true); // Set loading
    const [isUsersPost, setIsUsersPost] = useState(false);  // State to check if the post is the users

    // This hook automatically scrolls to the bottom of the comments
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments])

    // This hook fetches the comment data
    useEffect(() => {
        fetch(`${API_URL}/posts/comments/all/${postid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setComments(data.comments);
                setIsUsersPost(data.isUsersPost);
                setLoading(false);
            })
            .catch(err => {
                setError(true);
                setLoading(false);
            });
    }, [postid]);

    return (
        <main className="comment-section">
            {loading ? (
                <LoadingTitle/>
            ) : (

                (error ? (
                    <ErrorMessage
                        message={'Something went wrong loading the comments!'}
                        svg={
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m376-400 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
                    }
                    />
                ) : (
                    <>
                        <svg
                            onClick={() => navigate(-1)}
                            className={'back-icon'}
                            xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

                        <section className="comment-section-container">
                            {comments.length > 0 ? (
                                (comments.map(comment => (
                                    <CommentCard
                                        key={comment.id}
                                        comment={comment.comment}
                                        timestamp={comment.created_at ? comment.created_at : undefined}
                                        author={comment.user}
                                        commentSection={true}
                                        id = {comment.id}
                                        isUsersPost={isUsersPost}
                                        setComments={setComments}
                                    />
                                )))
                            ) : (
                                <ErrorMessage
                                    message={'No comments yet'}
                                    svg={
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m376-400 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>                    }/>
                            )}
                            <div ref={bottomRef} />
                        </section>

                        <CommentInput
                            setComments={setComments}
                            postId={postid}
                        />
                    </>
                ))
            )}
        </main>
    )
}