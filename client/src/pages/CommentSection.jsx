import {useEffect, useState} from "react";


import '../styles/CommentSection.css'
import {CommentInput} from "../components/CommentSectionComponents/CommentInput.jsx";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {CommentCard} from "../components/CommentSectionComponents/CommentCard.jsx";

export const CommentSection = ({}) => {


    const [comments, setComments] = useState([]);
    const {postid} = useParams();
    const {API_URL} = useAuth();


    useEffect(() => {

        fetch(`${API_URL}/posts/comments/all/${postid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setComments(data.comments || []);
            })
            .catch(err => console.log(err));

    }, [postid]);


    console.log(postid);

    return (
        <main className="comment-section">

            <h1>This is a comment section</h1>

            {comments.length > 0 ? (

                (comments.map(comment => (
                    <CommentCard
                        key={comment.id}
                        comment={comment.comment}
                        timestamp={comment.created_at ? comment.created_at : undefined}
                        user={comment.user || null}
                    />
                )))
            ) : (
                <p>No comments yet! </p>
            )}

            <CommentInput postId={postid} />

        </main>
    )
}