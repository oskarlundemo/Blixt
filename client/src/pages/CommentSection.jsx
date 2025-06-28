import {useEffect, useRef, useState} from "react";


import '../styles/CommentSection.css'
import {CommentInput} from "../components/CommentSectionComponents/CommentInput.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {CommentCard} from "../components/CommentSectionComponents/CommentCard.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";

export const CommentSection = ({}) => {

    const {token} = useAuth();
    const [comments, setComments] = useState([]);
    const {postid} = useParams();
    const {API_URL} = useAuth();
    const navigate = useNavigate();

    const bottomRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [isUsersPost, setIsUsersPost] = useState(false);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments])

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
                console.log(data);
                setComments(data.comments);
                setIsUsersPost(data.isUsersPost);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log(err)
            });

    }, [postid]);


    return (
        <main className="comment-section">

            {loading ? (
                <LoadingTitle/>
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
                        <p>No comments yet!</p>
                     )}
                        <div ref={bottomRef} />
                    </section>

                    <CommentInput
                        setComments={setComments}
                        postId={postid}
                    />
                </>
            )}

        </main>
    )
}