import {useEffect, useRef, useState} from "react";


import '../styles/CommentSection.css'
import {CommentInput} from "../components/CommentSectionComponents/CommentInput.jsx";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {CommentCard} from "../components/CommentSectionComponents/CommentCard.jsx";
import {supabase} from "../services/SupabaseClient.js";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {NavigationBar} from "../components/NavigationBar.jsx";

export const CommentSection = ({}) => {

    const {token} = useAuth();
    const [comments, setComments] = useState([]);
    const {postid} = useParams();
    const bottomRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [isUsersPost, setIsUsersPost] = useState(false);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments])


    const {API_URL} = useAuth();


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

                    <CommentInput
                        setComments={setComments}
                        postId={postid}
                    />
                </>
            )}


            <NavigationBar



            />

        </main>
    )
}